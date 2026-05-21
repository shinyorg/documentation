import JSZip from 'jszip';
import { templateFilesByKind, templateSourceName, type TemplateKind } from './templateFiles';
import { processTemplate, evaluateExclusionCondition } from './templateEngine';
import { computeSymbols, type TemplateState } from './templateData';
import { extname } from './utils';

function generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function generateProject(kind: TemplateKind, state: TemplateState): Promise<Blob> {
    const symbols = computeSymbols(kind, state);
    const projectName = state.projectName || 'MyApp';
    const sourceName = templateSourceName[kind];
    const sourceNamePattern = new RegExp(sourceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

    const replacements: Record<string, string> = {
        [sourceName]: projectName,
        '{APPLICATION_ID}': state.applicationId || 'com.companyname.app',
        '{DOTNET_TFM}': (state.Framework as string) || 'net10.0',
        '{DEEPLINK_HOST}': (state.deeplinks as string) || '',
        '{MSAL_CLIENT_ID}': (state.msalclientid as string) || '',
        '{MAUI_MAPS_ANDROID_KEY}': (state.mapsandroidkey as string) || '',
        '{CONNECTION_STRING}': (state.connectionstring as string) || '',
        '{APPLICATION_ID_GUID}': generateGuid(),
    };

    const zip = new JSZip();
    const projectFolder = zip.folder(projectName)!;
    const files = templateFilesByKind[kind];

    for (const file of files) {
        if (file.excludeConditions) {
            const excluded = file.excludeConditions.some(cond =>
                evaluateExclusionCondition(cond, symbols)
            );
            if (excluded) continue;
        }

        const outputPath = file.path.replace(sourceNamePattern, projectName);

        if (file.binary) {
            const binaryData = Uint8Array.from(atob(file.content), c => c.charCodeAt(0));
            projectFolder.file(outputPath, binaryData);
        } else if (file.copyOnly) {
            let content = file.content;
            for (const [search, replace] of Object.entries(replacements)) {
                content = content.split(search).join(replace);
            }
            projectFolder.file(outputPath, content);
        } else {
            const ext = extname(file.path);
            const processed = processTemplate(file.content, symbols, replacements, ext);
            projectFolder.file(outputPath, processed);
        }
    }

    return zip.generateAsync({ type: 'blob' });
}
