/**
 * Build-time consistency checks between the three places Shiny's builders read from:
 *
 * - `src/consts.ts` — every library (`ShinyComponents`), with versions taken from `VERSIONS`
 * - `src/components/TemplateBuilder/templateData.ts` — the Template Builder's options and `VERSIONS`
 * - `src/components/Boilerplate/componentTemplateMap.ts` — which Template Builder option(s) each library turns on
 *
 * plus the `.csproj` files inside `templateFiles.<kind>.ts`, whose package versions are literals that don't read
 * `VERSIONS`. `astro.config.mjs` runs this when the config loads, so `npm run dev` and `npm run build` both stop on
 * a library with no map entry, a map entry pointing at an option that doesn't exist, or a template `.csproj` still
 * on an old version after a bump.
 */
import { ShinyComponents } from '../consts';
import { componentTemplateMap } from '../components/Boilerplate/componentTemplateMap';
import { TEMPLATE_CONFIGS } from '../components/TemplateBuilder/templateData';
import { templateFilesByKind, type TemplateKind } from '../components/TemplateBuilder/templateFiles';

export function checkBuilderIntegrity(): string[] {
    const errors: string[] = [];
    const ids = new Set(ShinyComponents.map(c => c.id));

    // 1. every library maps to the Template Builder, and every map entry is a real library
    for (const id of ids) {
        if (!componentTemplateMap[id]?.length)
            errors.push(`consts.ts '${id}' has no entry in componentTemplateMap.ts (its LibBuilder can't render)`);
    }
    for (const id of Object.keys(componentTemplateMap)) {
        if (!ids.has(id))
            errors.push(`componentTemplateMap.ts '${id}' is not a component id in consts.ts`);
    }

    // 2. every map entry names an option (and a valid choice) that exists in that template
    for (const [id, refs] of Object.entries(componentTemplateMap)) {
        for (const ref of refs) {
            if (!ref.paramId) continue;
            const param = TEMPLATE_CONFIGS[ref.kind].params.find(p => p.id === ref.paramId);
            if (!param) {
                errors.push(`componentTemplateMap.ts '${id}' -> ${ref.kind} option '${ref.paramId}' does not exist in templateData.ts`);
            } else if (param.type === 'choice') {
                if (ref.value === undefined)
                    errors.push(`componentTemplateMap.ts '${id}' -> ${ref.kind} '${ref.paramId}' is a choice and needs a value`);
                else if (!param.choices?.some(c => c.value === ref.value))
                    errors.push(`componentTemplateMap.ts '${id}' -> ${ref.kind} '${ref.paramId}' has no choice '${ref.value}'`);
            } else if (param.type === 'bool' && ref.value !== undefined) {
                errors.push(`componentTemplateMap.ts '${id}' -> ${ref.kind} '${ref.paramId}' is a bool and takes no value`);
            }
        }
    }

    // 3. template .csproj package versions match the version consts.ts (i.e. VERSIONS) has for that package
    const expected = new Map<string, string>();
    for (const c of ShinyComponents) {
        for (const nuget of [c.nuget, c.blazorNuget, c.aspnetNuget, c.linuxNuget])
            if (nuget) expected.set(nuget.toLowerCase(), c.version);
        for (const extra of c.additionalNugets ?? [])
            expected.set(extra.nuget.toLowerCase(), extra.version);
    }
    for (const [kind, files] of Object.entries(templateFilesByKind) as [TemplateKind, typeof templateFilesByKind[TemplateKind]][]) {
        for (const file of files.filter(f => f.path.endsWith('.csproj'))) {
            const props = new Map<string, string>();
            for (const m of file.content.matchAll(/<(\w+)>([^<$]+)<\/\1>/g))
                if (!props.has(m[1])) props.set(m[1], m[2].trim());

            // a stale MSBuild property (e.g. <ShinyVersion>) is reported once, with the packages that read it
            const staleProps = new Map<string, { have: string; want: string; packages: string[] }>();
            for (const m of file.content.matchAll(/<PackageReference\s+Include="([^"]+)"\s+Version="([^"]+)"/g)) {
                const want = expected.get(m[1].toLowerCase());
                if (!want) continue;
                const prop = /^\$\((\w+)\)$/.exec(m[2])?.[1];
                const have = prop ? props.get(prop) : m[2];
                if (have === undefined || have === want) continue;
                if (!prop) {
                    errors.push(`${kind} ${file.path}: ${m[1]} is ${have}, VERSIONS says ${want}`);
                    continue;
                }
                const key = `${prop}=${want}`;
                const entry = staleProps.get(key) ?? { have, want, packages: [] };
                if (!entry.packages.includes(m[1])) entry.packages.push(m[1]);
                staleProps.set(key, entry);
            }
            for (const [key, e] of staleProps)
                errors.push(`${kind} ${file.path}: <${key.split('=')[0]}> is ${e.have}, VERSIONS says ${e.want} (${e.packages.join(', ')})`);
        }
    }
    return errors;
}
