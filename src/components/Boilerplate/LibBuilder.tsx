import { useState } from 'react';
import { mappedKinds, buildSingleLibState, KIND_LABELS } from './componentTemplateMap';
import { buildProjectFiles, STABLE_GUID } from '../TemplateBuilder/buildProjectFiles';
import FileTreePreview from '../TemplateBuilder/FileTreePreview';
import type { TemplateKind } from '../TemplateBuilder/templateFiles';

interface Props {
    componentName: string;
}

/** Lib Builder driven by the Template Builder engine: previews the files a single library adds/changes. */
const LibBuilder = ({ componentName }: Props) => {
  const kinds = mappedKinds(componentName);
  // scripts/check-builders.mjs fails the build first; this guards a page using an id it doesn't know
  if (kinds.length === 0)
    throw new Error(`LibBuilder: '${componentName}' has no entry in componentTemplateMap.ts`);

  const [kind, setKind] = useState<TemplateKind>(kinds[0]);
  const files = buildProjectFiles(kind, buildSingleLibState(componentName, kind), { applicationIdGuid: STABLE_GUID });

  return (
    <div className="app-builder">
      {kinds.length > 1 && (
        <div className="app-builder__mode-toggle">
          {kinds.map(k => (
            <button
              key={k}
              className={`app-builder__mode-btn${kind === k ? ' app-builder__mode-btn--active' : ''}`}
              onClick={() => setKind(k)}
            >
              {KIND_LABELS[k]}
            </button>
          ))}
        </div>
      )}
      <div className="app-builder__output">
        <FileTreePreview files={files} rootName="MyApp" setupOnly />
      </div>
    </div>
  );
};

export default LibBuilder;
