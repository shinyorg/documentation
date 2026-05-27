// Publishes each Blazor WASM sample under playground/ and copies the resulting
// wwwroot into public/playground/<slug>/ so Astro picks them up at build time.
//
// Triggered automatically via `prebuild` in package.json — also runnable directly.
// Requires: dotnet 10.x on PATH.

import { execSync } from 'node:child_process';
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

const isDebug = process.argv.includes('--debug');
const config = isDebug ? 'Debug' : 'Release';

const apps = [
    { dir: 'AiConversation', slug: 'aiconversation', csproj: 'AiConversation.csproj' },
    { dir: 'Controls',       slug: 'controls',       csproj: 'Controls.csproj' },
    { dir: 'DocumentDb',     slug: 'documentdb',     csproj: 'DocumentDb.csproj' },
    { dir: 'Mediator',       slug: 'mediator',       csproj: 'Mediator.csproj' },
    { dir: 'Shiny',          slug: 'shiny',          csproj: 'Shiny.csproj' },
    { dir: 'Speech',         slug: 'speech',         csproj: 'Speech.csproj' },
];

const tmpRoot = join(repoRoot, 'tmp-playground');
const outRoot = join(repoRoot, 'public', 'playground');

rmSync(tmpRoot, { recursive: true, force: true });
mkdirSync(outRoot, { recursive: true });

console.log(`Publishing playground apps (${config})\n`);

for (const app of apps) {
    const csprojPath = join(repoRoot, 'playground', app.dir, app.csproj);
    const publishDir = join(tmpRoot, app.slug);
    const destDir = join(outRoot, app.slug);

    console.log(`>>> ${app.dir}`);
    // withastro/action exports VERSION=latest, which MSBuild picks up as $(Version).
    // NuGet's RestoreTask then rejects "latest" when computing project identity.
    const { VERSION, ...env } = process.env;
    execSync(
        `dotnet publish "${csprojPath}" -c ${config} -o "${publishDir}" --nologo`,
        { stdio: 'inherit', cwd: repoRoot, env }
    );

    const wwwroot = join(publishDir, 'wwwroot');
    if (!existsSync(wwwroot)) {
        throw new Error(`Expected published wwwroot not found: ${wwwroot}`);
    }

    rmSync(destDir, { recursive: true, force: true });
    mkdirSync(destDir, { recursive: true });
    cpSync(wwwroot, destDir, { recursive: true });
    console.log(`    copied → ${destDir}\n`);
}

rmSync(tmpRoot, { recursive: true, force: true });
console.log('Playground build complete.');
