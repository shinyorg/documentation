import JSZip from 'jszip';
import { buildProjectFiles } from './buildProjectFiles';
import type { TemplateKind } from './templateFiles';
import type { TemplateState } from './templateData';

export async function generateProject(kind: TemplateKind, state: TemplateState): Promise<Blob> {
    // Fresh random GUID per download; setup flags aren't needed for the zip.
    const files = buildProjectFiles(kind, state, { computeSetup: false });
    const projectName = state.projectName || 'MyApp';

    const zip = new JSZip();
    const projectFolder = zip.folder(projectName)!;

    for (const file of files) {
        if (file.binary) {
            const binaryData = Uint8Array.from(atob(file.content), c => c.charCodeAt(0));
            projectFolder.file(file.path, binaryData);
        } else {
            projectFolder.file(file.path, file.content);
        }
    }

    return zip.generateAsync({ type: 'blob' });
}
