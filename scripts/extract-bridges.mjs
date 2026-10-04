#!/usr/bin/env node
/**
 * Builds the App Device Bridge API reference (src/data/appdevicebridge/bridges.json) from the sibling
 * Shiny.AppDeviceBridge repo. Those sources are the single source of truth:
 *
 *   - clients/typescript/src/*.ts — the TypeScript clients, generated from each bridge's [BridgeClient] interface.
 *     They carry every route, verb, query parameter, body, response, event and the doc comment of each.
 *   - src/**\/I*Bridge.cs (+ the built-in Files/Host/Links/Settings bridges) — read only for the C# method names.
 *
 * Usage:  node scripts/extract-bridges.mjs [path-to-webapphost-repo]
 * Default repo path: ~/Desktop/dev/webapphost
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(process.argv[2] ?? path.join(os.homedir(), 'Desktop/dev/webapphost'));
const tsDir = path.join(repo, 'clients/typescript/src');
const outFile = path.join(here, '../src/data/appdevicebridge/bridges.json');

if (!fs.existsSync(tsDir)) {
  console.error(`TypeScript clients not found at ${tsDir}`);
  process.exit(1);
}

// The compiler API comes from the client package's own TypeScript (5.x); this repo's TypeScript 7 has no JS API.
const ts = createRequire(path.join(repo, 'clients/typescript/package.json'))('typescript');

// ---------------------------------------------------------------- C# method names

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'obj' || e.name === 'bin' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.cs')) out.push(p);
  }
  return out;
}

const csNames = new Map(); // "GET gps/status" | "event gps.reading" → C# method name
for (const file of walk(path.join(repo, 'src'))) {
  const text = fs.readFileSync(file, 'utf8');
  const client = text.match(/\[BridgeClient\("([^"]+)"/);
  if (!client) continue;
  const prefix = client[1];
  const re = /\[Bridge(Get|Post|Put|Delete|Event)\((?:"([^"]*)")?\)\][\s\S]*?\s([A-Z]\w*)\s*\(/g;
  let m;
  while ((m = re.exec(text))) {
    const [, kind, pattern = '', method] = m;
    if (kind === 'Event') csNames.set(`event ${pattern}`, method);
    else {
      const route = [prefix, pattern].filter(Boolean).join('/');
      const key = `${kind.toUpperCase()} ${route}`;
      // Two C# overloads may share a route (ReadBytes / OpenRead); keep every name.
      csNames.set(key, csNames.has(key) ? `${csNames.get(key)}|${method}` : method);
    }
  }
}

// ---------------------------------------------------------------- TypeScript clients

const docOf = (node) =>
  ts.getJSDocCommentsAndTags(node)
    .filter(ts.isJSDoc)
    .map((d) => (typeof d.comment === 'string' ? d.comment : ts.getTextOfJSDocComment(d.comment) ?? ''))
    .join('\n')
    .trim();

const types = {};
const bridges = [];
const tsRouteNames = new Map();

const files = fs.readdirSync(tsDir).filter((f) => f.endsWith('.ts') && !['core.ts', 'index.ts'].includes(f)).sort();

for (const file of files) {
  const src = ts.createSourceFile(file, fs.readFileSync(path.join(tsDir, file), 'utf8'), ts.ScriptTarget.Latest, true);
  const text = (n) => n.getText(src);

  for (const stmt of src.statements) {
    if (ts.isInterfaceDeclaration(stmt)) {
      types[stmt.name.text] = {
        kind: 'object',
        summary: docOf(stmt),
        fields: stmt.members.filter(ts.isPropertySignature).map((p) => ({
          name: text(p.name),
          type: text(p.type),
          optional: !!p.questionToken,
          doc: docOf(p),
        })),
      };
    } else if (ts.isTypeAliasDeclaration(stmt)) {
      const t = stmt.type;
      const literals = ts.isUnionTypeNode(t) && t.types.every((u) => ts.isLiteralTypeNode(u) && ts.isStringLiteral(u.literal));
      types[stmt.name.text] = literals
        ? { kind: 'enum', summary: docOf(stmt), values: t.types.map((u) => u.literal.text) }
        : { kind: 'alias', summary: docOf(stmt), type: text(t) };
    } else if (ts.isClassDeclaration(stmt) && stmt.name && /Bridge$/.test(stmt.name.text)) {
      const bridge = { name: stmt.name.text, file, summary: docOf(stmt), prefix: null, requests: [], events: [] };

      for (const member of stmt.members) {
        if (!ts.isMethodDeclaration(member) || !member.body) continue;
        const name = text(member.name);
        const summary = docOf(member);
        const params = member.parameters;

        let call;
        member.body.forEachChild(function find(n) {
          if (!call && ts.isCallExpression(n)) {
            const callee = text(n.expression);
            if (/^(call|callVoid|callBlob)(<.*>)?$/.test(callee) || callee === 'this.transport.subscribe') call = n;
          }
          if (!call) n.forEachChild(find);
        });
        if (!call) continue;

        if (text(call.expression) === 'this.transport.subscribe') {
          const event = call.arguments[0].text;
          const handler = params[0]?.type;
          const payload = handler && ts.isFunctionTypeNode(handler) ? text(handler.parameters[0].type) : 'unknown';
          bridge.events.push({ event, ts: name, cs: csNames.get(`event ${event}`) ?? null, summary, payload });
          continue;
        }

        const callee = text(call.expression);
        const [, verbArg, pathArg, optsArg] = call.arguments;
        const verb = verbArg.text;

        // `files/${segment(root)}/list` + query({ path: options?.path })
        let template = pathArg;
        let queryObj = null;
        if (ts.isBinaryExpression(pathArg)) {
          template = pathArg.left;
          queryObj = pathArg.right.arguments?.[0];
        }
        const route = ts.isNoSubstitutionTemplateLiteral(template)
          ? template.text
          : template.head.text + template.templateSpans.map((s) => `{${text(s.expression).replace(/^segment\((.*)\)$/, '$1')}}` + s.literal.text).join('');

        const paramType = new Map();
        const optionTypes = new Map();
        for (const p of params) {
          if (text(p.name) === 'options' && p.type && ts.isTypeLiteralNode(p.type)) {
            for (const o of p.type.members) if (text(o.name) !== 'signal') optionTypes.set(text(o.name), text(o.type));
          } else paramType.set(text(p.name), { type: text(p.type), optional: !!p.questionToken });
        }

        const routeParams = [...route.matchAll(/\{(\w+)\}/g)].map(([, n]) => ({ name: n, type: paramType.get(n)?.type ?? 'string' }));

        const query = [];
        for (const prop of queryObj?.properties ?? []) {
          const qname = text(prop.name);
          const value = text(prop.initializer).replace(/^dateText\((.*)\)$/, '$1');
          const fromOptions = value.startsWith('options?.');
          const source = value.replace(/^options\?\./, '');
          const t = fromOptions ? optionTypes.get(source) : paramType.get(source)?.type;
          query.push({ name: qname, type: t ?? 'string', optional: fromOptions || !!paramType.get(source)?.optional });
        }

        let body = null;
        for (const prop of optsArg?.properties ?? []) {
          const key = text(prop.name);
          if (key === 'json') {
            const source = text(prop.initializer);
            body = { kind: 'json', name: source, type: paramType.get(source)?.type ?? 'unknown', optional: !!paramType.get(source)?.optional };
          } else if (key === 'body') {
            const source = text(prop.initializer);
            const ct = optsArg.properties.find((x) => text(x.name) === 'contentType');
            body = { kind: 'raw', name: source, type: paramType.get(source)?.type ?? 'unknown', contentType: ct ? ct.initializer.text : 'application/octet-stream' };
          }
        }

        let returns = 'void';
        if (callee === 'callBlob') returns = 'Blob';
        else if (callee === 'call') returns = call.typeArguments ? text(call.typeArguments[0]) : 'unknown';

        const prefix = route.split('/')[0];
        bridge.prefix ??= prefix;
        const key = `${verb} ${route.replace(/\{[^}]+\}/g, (s) => s)}`;
        bridge.requests.push({
          ts: name,
          cs: null,
          verb,
          route,
          summary,
          routeParams,
          query,
          body,
          returns,
          errors: [...new Set([...summary.matchAll(/\b([45]\d\d)\b/g)].map((x) => Number(x[1])))].sort(),
          key,
        });
      }

      bridges.push(bridge);
    }
  }
}

// Match C# names by verb + route; route params may be named differently in C# ({id} vs {regionId}), so compare
// with the parameters blanked out.
const normal = (k) => k.replace(/\{[^}]+\}/g, '{}');
const csByNormal = new Map([...csNames].map(([k, v]) => [normal(k), v]));
for (const b of bridges) {
  for (const r of b.requests) {
    const names = (csByNormal.get(normal(r.key)) ?? '').split('|').filter(Boolean);
    const pascal = r.ts[0].toUpperCase() + r.ts.slice(1) + 'Async';
    r.cs = names.includes(pascal) ? pascal : names[0] ?? pascal;
    delete r.key;
  }
  for (const e of b.events) e.cs ??= 'O' + e.ts.slice(1) + 'Async';
}

// Merge requests that share verb + route (e.g. readBytes / openRead) into one entry with several client methods.
for (const b of bridges) {
  const merged = [];
  for (const r of b.requests) {
    const same = merged.find((m) => m.verb === r.verb && m.route === r.route && JSON.stringify(m.query) === JSON.stringify(r.query) && m.body?.contentType === r.body?.contentType);
    if (same) {
      same.overloads.push({ ts: r.ts, cs: r.cs, summary: r.summary });
    } else merged.push({ ...r, overloads: [] });
  }
  b.requests = merged;
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ source: 'Shiny.AppDeviceBridge clients/typescript', bridges, types }, null, 2) + '\n');

const r = bridges.reduce((n, b) => n + b.requests.length, 0);
const e = bridges.reduce((n, b) => n + b.events.length, 0);
console.log(`${bridges.length} bridges, ${r} requests, ${e} events, ${Object.keys(types).length} types → ${path.relative(process.cwd(), outFile)}`);
