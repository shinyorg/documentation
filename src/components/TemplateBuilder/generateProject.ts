import JSZip from 'jszip';
import { templateFiles } from './templateFiles';
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

export async function generateProject(state: TemplateState): Promise<Blob> {
    const symbols = computeSymbols(state);
    const projectName = state.projectName || 'MyApp';

    // String replacements
    const replacements: Record<string, string> = {
        'ShinyApp': projectName,
        '{APPLICATION_ID}': state.applicationId || 'com.companyname.app',
        '{DOTNET_TFM}': (state.Framework as string) || 'net10.0',
        '{DEEPLINK_HOST}': (state.deeplinks as string) || '',
        '{MSAL_CLIENT_ID}': (state.msalclientid as string) || '',
        '{MAUI_MAPS_ANDROID_KEY}': (state.mapsandroidkey as string) || '',
        '{APPLICATION_ID_GUID}': generateGuid(),
    };

    const zip = new JSZip();
    const projectFolder = zip.folder(projectName)!;

    for (const file of templateFiles) {
        // Check exclusion conditions
        if (file.excludeConditions) {
            const excluded = file.excludeConditions.some(cond =>
                evaluateExclusionCondition(cond, symbols)
            );
            if (excluded) continue;
        }

        // Compute output path (rename ShinyApp in paths)
        const outputPath = file.path.replace(/ShinyApp/g, projectName);

        if (file.binary) {
            // Decode base64 binary content
            const binaryData = Uint8Array.from(atob(file.content), c => c.charCodeAt(0));
            projectFolder.file(outputPath, binaryData);
        } else if (file.copyOnly) {
            // Copy without processing, but still do name replacements in path
            let content = file.content;
            // Still apply name replacements in content for non-binary copy-only files
            for (const [search, replace] of Object.entries(replacements)) {
                content = content.split(search).join(replace);
            }
            projectFolder.file(outputPath, content);
        } else {
            // Process through template engine
            const ext = extname(file.path);
            const processed = processTemplate(file.content, symbols, replacements, ext);
            projectFolder.file(outputPath, processed);
        }
    }

    return zip.generateAsync({ type: 'blob' });
}
