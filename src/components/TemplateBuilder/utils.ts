/** Get file extension from a path */
export function extname(path: string): string {
    const lastDot = path.lastIndexOf('.');
    if (lastDot === -1) return '';
    // Handle double extensions like .xaml.cs, .razor.css
    const secondLastDot = path.lastIndexOf('.', lastDot - 1);
    // Only return the last extension
    return path.substring(lastDot);
}
