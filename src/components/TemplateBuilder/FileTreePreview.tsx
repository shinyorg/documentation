import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import CodeView from './CodeView';
import type { GeneratedFile } from './buildProjectFiles';
import { extname } from './utils';

interface FileTreePreviewProps {
    files: GeneratedFile[];
    /** Project root folder name (synthetic top node). */
    rootName: string;
    /** Show only files flagged isSetup (single-library Lib Builder view). */
    setupOnly?: boolean;
    initialSelectedPath?: string;
}

interface TreeNode {
    name: string;
    path: string;          // full path of this node
    file?: GeneratedFile;  // present on leaves
    children: Map<string, TreeNode>;
    hasSetup: boolean;     // this node or a descendant is a setup file
}

/** Map a file extension to a Prism language id (csharp/xml) or undefined for plain text. */
function inferLang(path: string): string | undefined {
    const ext = extname(path).toLowerCase();
    switch (ext) {
        case '.cs':
        case '.razor':
            return 'csharp';
        case '.csproj':
        case '.xml':
        case '.plist':
        case '.xcprivacy':
        case '.appxmanifest':
        case '.xaml':
        case '.entitlements':
        case '.props':
        case '.targets':
            return 'xml';
        default:
            return undefined; // json, md, txt, etc. -> plain
    }
}

function buildTree(files: GeneratedFile[]): TreeNode {
    const root: TreeNode = { name: '', path: '', children: new Map(), hasSetup: false };
    for (const file of files) {
        const parts = file.path.split('/').filter(Boolean);
        let node = root;
        let acc = '';
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            acc = acc ? `${acc}/${part}` : part;
            let child = node.children.get(part);
            if (!child) {
                child = { name: part, path: acc, children: new Map(), hasSetup: false };
                node.children.set(part, child);
            }
            if (i === parts.length - 1) child.file = file;
            if (file.isSetup) child.hasSetup = true;
            node = child;
        }
    }
    // Propagate hasSetup up from leaves.
    const propagate = (n: TreeNode): boolean => {
        let setup = !!n.file?.isSetup;
        for (const c of n.children.values()) {
            if (propagate(c)) setup = true;
        }
        n.hasSetup = setup;
        return setup;
    };
    propagate(root);
    return root;
}

/** Sort children: folders before files, each alphabetical. */
function sortedChildren(node: TreeNode): TreeNode[] {
    return [...node.children.values()].sort((a, b) => {
        const aFolder = a.children.size > 0 || !a.file;
        const bFolder = b.children.size > 0 || !b.file;
        if (aFolder !== bFolder) return aFolder ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
}

function firstFile(node: TreeNode, preferSetup: boolean): GeneratedFile | undefined {
    // Depth-first; optionally prefer the first setup file.
    const walk = (n: TreeNode, wantSetup: boolean): GeneratedFile | undefined => {
        for (const c of sortedChildren(n)) {
            if (c.file && (!wantSetup || c.file.isSetup)) return c.file;
            const found = walk(c, wantSetup);
            if (found) return found;
        }
        return undefined;
    };
    if (preferSetup) {
        const s = walk(node, true);
        if (s) return s;
    }
    return walk(node, false);
}

interface TreeRowProps {
    node: TreeNode;
    depth: number;
    selectedPath: string | null;
    onSelect: (file: GeneratedFile) => void;
    showBadge: boolean;
}

const TreeRow = ({ node, depth, selectedPath, onSelect, showBadge }: TreeRowProps) => {
    const [open, setOpen] = useState(true);
    const isFolder = !node.file;
    const indent = { paddingLeft: `${depth * 0.85 + 0.5}rem` };

    if (isFolder) {
        return (
            <li className="file-tree-preview__node">
                <button
                    type="button"
                    className="file-tree-preview__row file-tree-preview__row--folder"
                    style={indent}
                    onClick={() => setOpen(o => !o)}
                >
                    <span className={`file-tree-preview__caret${open ? ' file-tree-preview__caret--open' : ''}`}>▸</span>
                    <span className="file-tree-preview__name">{node.name}</span>
                </button>
                {open && (
                    <ul className="file-tree-preview__children">
                        {sortedChildren(node).map(c => (
                            <TreeRow key={c.path} node={c} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} showBadge={showBadge} />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    const file = node.file!;
    const selected = selectedPath === file.path;
    return (
        <li className="file-tree-preview__node">
            <button
                type="button"
                className={`file-tree-preview__row file-tree-preview__row--file${selected ? ' file-tree-preview__row--selected' : ''}`}
                style={indent}
                onClick={() => onSelect(file)}
            >
                <span className="file-tree-preview__name">{node.name}</span>
                {showBadge && file.isSetup && <span className="file-tree-preview__badge">setup</span>}
            </button>
        </li>
    );
};

const FileTreePreview = ({ files, rootName, setupOnly, initialSelectedPath }: FileTreePreviewProps) => {
    const shown = useMemo(
        () => (setupOnly ? files.filter(f => f.isSetup) : files),
        [files, setupOnly]
    );

    const tree = useMemo(() => buildTree(shown), [shown]);

    const defaultFile = useMemo(() => {
        if (initialSelectedPath) {
            const match = shown.find(f => f.path === initialSelectedPath);
            if (match) return match;
        }
        return firstFile(tree, !setupOnly);
    }, [tree, shown, initialSelectedPath, setupOnly]);

    const [selectedPath, setSelectedPath] = useState<string | null>(defaultFile?.path ?? null);

    // When the file set changes (selections toggled), keep the selection valid.
    useEffect(() => {
        if (!selectedPath || !shown.some(f => f.path === selectedPath)) {
            setSelectedPath(defaultFile?.path ?? null);
        }
    }, [shown, defaultFile, selectedPath]);

    const selected = useMemo(
        () => shown.find(f => f.path === selectedPath) ?? null,
        [shown, selectedPath]
    );

    const setupCount = useMemo(() => files.filter(f => f.isSetup).length, [files]);

    if (shown.length === 0) {
        return (
            <div className="file-tree-preview file-tree-preview--empty">
                <p className="file-tree-preview__empty-text">
                    {setupOnly ? 'No files change for this selection — pick a library above to see what it adds.' : 'No files to preview.'}
                </p>
            </div>
        );
    }

    return (
        <div className="file-tree-preview">
            <div className="file-tree-preview__tree">
                <div className="file-tree-preview__tree-header">
                    <span className="file-tree-preview__tree-title">{setupOnly ? 'Changed files' : 'Project files'}</span>
                    {!setupOnly && setupCount > 0 && (
                        <span className="file-tree-preview__tree-meta">{setupCount} changed</span>
                    )}
                </div>
                <ul className="file-tree-preview__root">
                    <li className="file-tree-preview__node">
                        <div className="file-tree-preview__row file-tree-preview__row--root">
                            <span className="file-tree-preview__name">{rootName}/</span>
                        </div>
                        <ul className="file-tree-preview__children">
                            {sortedChildren(tree).map(c => (
                                <TreeRow key={c.path} node={c} depth={1} selectedPath={selectedPath} onSelect={f => setSelectedPath(f.path)} showBadge={!setupOnly} />
                            ))}
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="file-tree-preview__viewer">
                {selected ? (
                    <>
                        <div className="file-tree-preview__viewer-path">
                            {selected.path}
                            {!setupOnly && selected.isSetup && <span className="file-tree-preview__badge">setup</span>}
                        </div>
                        {selected.binary ? (
                            <div className="file-tree-preview__binary">Binary file — included in the downloaded project.</div>
                        ) : (
                            <CodeView
                                source={selected.content}
                                language={inferLang(selected.path)}
                                changedLines={selected.changedLines}
                                label={selected.path.split('/').pop()}
                            />
                        )}
                    </>
                ) : (
                    <div className="file-tree-preview__binary">Select a file to preview.</div>
                )}
            </div>
        </div>
    );
};

export default FileTreePreview;
