import JSZip from 'jszip';
import type { ThemePlatform } from './emit';

/** Bundles every generated artifact into a single `<slug>-theme.zip`. */
export async function generateThemeZip(slug: string, platforms: ThemePlatform[]): Promise<Blob> {
    const zip = new JSZip();
    const root = zip.folder(`${slug}-theme`)!;

    for (const platform of platforms) {
        for (const file of platform.files) {
            root.file(file.path, file.content);
        }
    }

    return zip.generateAsync({ type: 'blob' });
}
