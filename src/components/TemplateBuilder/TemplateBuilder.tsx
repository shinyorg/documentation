import { useState, useCallback } from 'react';
import React from 'react';
import { TEMPLATE_PARAMS, CATEGORIES, getDefaultState, type TemplateState, type TemplateParam } from './templateData';
import { generateProject } from './generateProject';
import Dropdown from './Dropdown';

/** Turn plain-text URLs in a string into clickable links (target=_blank). */
function linkify(text: string): React.ReactNode[] {
    const urlRegex = /(https?:\/\/[^\s,|)]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
        urlRegex.test(part)
            ? <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
            : <React.Fragment key={i}>{part}</React.Fragment>
    );
}

/** Get the description for the currently selected choice value. */
function getChoiceDescription(param: TemplateParam, currentValue: string): string | undefined {
    if (!param.choices) return undefined;
    const choice = param.choices.find(c => c.value === currentValue);
    return choice?.description;
}

const TemplateBuilder = () => {
    const [state, setState] = useState<TemplateState>(getDefaultState);
    const [generating, setGenerating] = useState(false);

    const updateState = useCallback((key: string, value: string | boolean) => {
        setState(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleDownload = useCallback(async () => {
        setGenerating(true);
        try {
            const blob = await generateProject(state);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${state.projectName || 'MyApp'}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setGenerating(false);
        }
    }, [state]);

    const platformIcons: Record<string, React.ReactNode> = {
        useios: (
            <svg className="template-builder__platform-icon" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
        ),
        useandroid: (
            <svg className="template-builder__platform-icon" viewBox="0 0 576 512" fill="currentColor">
                <path d="M420.55 301.93a24 24 0 1 1 24-24 24 24 0 0 1-24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1-24 24m273.7-144.48 47.94-83a10 10 0 1 0-17.27-10l-48.54 84.07a306.2 306.2 0 0 0-122.27-25.87 306.2 306.2 0 0 0-122.27 25.87L118.4 64.45a10 10 0 1 0-17.27 10l47.94 83C64.53 202.22 8.24 285.55 0 384h576c-8.24-98.45-64.54-181.78-149.15-226.55"/>
            </svg>
        ),
        usemaccatalyst: (
            <svg className="template-builder__platform-icon" viewBox="0 0 640 512" fill="currentColor">
                <path d="M64 96c0-35.3 28.7-64 64-64l384 0c35.3 0 64 28.7 64 64l0 256-64 0 0-256L128 96l0 256-64 0L64 96zM0 403.2C0 392.6 8.6 384 19.2 384l601.6 0c10.6 0 19.2 8.6 19.2 19.2c0 42.4-34.4 76.8-76.8 76.8L76.8 480C34.4 480 0 445.6 0 403.2zM288 320l64 0 0 32-64 0 0-32z"/>
            </svg>
        ),
        usewindows: (
            <svg className="template-builder__platform-icon" viewBox="0 0 448 512" fill="currentColor">
                <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"/>
            </svg>
        ),
    };

    const choiceParams = TEMPLATE_PARAMS.filter(p => p.type === 'choice');
    const stringParams = TEMPLATE_PARAMS.filter(p => p.type === 'string');
    const boolParams = TEMPLATE_PARAMS.filter(p => p.type === 'bool' && p.category !== 'project');
    const platformParams = TEMPLATE_PARAMS.filter(p => p.type === 'bool' && p.category === 'project' && !p.description);
    const projectFeatures = TEMPLATE_PARAMS.filter(p => p.type === 'bool' && p.category === 'project' && p.description);

    const isVisible = (p: { visibleWhen?: (state: TemplateState) => boolean }) =>
        !p.visibleWhen || p.visibleWhen(state);

    const renderDescription = (desc?: string) => {
        if (!desc) return null;
        return <span className="template-builder__desc">{linkify(desc)}</span>;
    };

    const renderChoiceWithDescription = (p: TemplateParam) => {
        const choiceDesc = getChoiceDescription(p, state[p.id] as string);
        return (
            <div key={p.id} className="template-builder__choice-group">
                <Dropdown
                    label={p.label}
                    options={p.choices!.map(c => ({ value: c.value, label: c.label, description: c.description }))}
                    value={state[p.id] as string}
                    onChange={val => updateState(p.id, val)}
                />
                {choiceDesc && (
                    <span className="template-builder__choice-desc">{linkify(choiceDesc)}</span>
                )}
            </div>
        );
    };

    return (
        <div className="template-builder">
            {/* Project info */}
            <section className="template-builder__section template-builder__section--span-12">
                <header className="template-builder__section-header">
                    <span className="template-builder__section-title">Project</span>
                </header>
                <div className="template-builder__inputs">
                    <label className="template-builder__input-group">
                        <span className="template-builder__input-label">Project Name</span>
                        <input
                            type="text"
                            value={state.projectName}
                            onChange={e => updateState('projectName', e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))}
                            className="template-builder__input"
                            placeholder="MyApp"
                        />
                    </label>
                    <label className="template-builder__input-group">
                        <span className="template-builder__input-label">Application ID</span>
                        <input
                            type="text"
                            value={state.applicationId}
                            onChange={e => updateState('applicationId', e.target.value)}
                            className="template-builder__input"
                            placeholder="com.companyname.app"
                        />
                    </label>
                    {/* Project-level choice dropdowns (inline in the row) */}
                    {choiceParams.filter(p => p.category === 'project').map(p => (
                        <Dropdown
                            key={p.id}
                            label={p.label}
                            options={p.choices!.map(c => ({ value: c.value, label: c.label }))}
                            value={state[p.id] as string}
                            onChange={val => updateState(p.id, val)}
                        />
                    ))}
                </div>
                <div className="template-builder__platforms">
                    <span className="template-builder__input-label">Platforms</span>
                    <div className="template-builder__platform-toggles">
                        {platformParams.map(p => (
                            <label
                                key={p.id}
                                className={`template-builder__platform-toggle${state[p.id] ? ' template-builder__platform-toggle--active' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={!!state[p.id]}
                                    onChange={e => updateState(p.id, e.target.checked)}
                                    className="template-builder__checkbox"
                                />
                                {platformIcons[p.id]}
                                <span>{p.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {projectFeatures.map(p => (
                    <label
                        key={p.id}
                        className={`template-builder__feature-callout${state[p.id] ? ' template-builder__feature-callout--active' : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={!!state[p.id]}
                            onChange={e => updateState(p.id, e.target.checked)}
                            className="template-builder__checkbox"
                        />
                        <span className="template-builder__feature-callout-toggle">
                            <span className="template-builder__feature-callout-track" />
                        </span>
                        <span className="template-builder__feature-callout-content">
                            <span className="template-builder__feature-callout-header">
                                <span className="template-builder__feature-callout-title">{p.label}</span>
                                {p.version && <span className="template-builder__version">{p.version}</span>}
                            </span>
                            {p.description && (
                                <span className="template-builder__feature-callout-desc">{linkify(p.description)}</span>
                            )}
                        </span>
                    </label>
                ))}
            </section>

            {/* Category sections */}
            {CATEGORIES.filter(cat => cat.id !== 'project').map(cat => {
                const catChoices = choiceParams.filter(p => p.category === cat.id && isVisible(p));
                const catStrings = stringParams.filter(p => p.category === cat.id && isVisible(p));
                const catBools = boolParams.filter(p => p.category === cat.id && isVisible(p));
                const hasContent = catChoices.length > 0 || catStrings.length > 0 || catBools.length > 0;
                if (!hasContent) return null;

                return (
                    <section
                        key={cat.id}
                        className={`template-builder__section template-builder__section--span-${cat.span}`}
                    >
                        <header className="template-builder__section-header">
                            <span className="template-builder__section-title">{cat.title}</span>
                            <span className="template-builder__section-count">
                                {catBools.filter(p => state[p.id] === true).length > 0 &&
                                    `${catBools.filter(p => state[p.id] === true).length} selected`}
                            </span>
                        </header>
                        <div className="template-builder__section-content">
                            {/* Dropdowns with inline descriptions */}
                            {catChoices.map(p => renderChoiceWithDescription(p))}
                            {/* String inputs */}
                            {catStrings.length > 0 && (
                                <div className="template-builder__inputs">
                                    {catStrings.map(p => (
                                        <label key={p.id} className="template-builder__input-group">
                                            <span className="template-builder__input-label">{p.label}</span>
                                            <input
                                                type="text"
                                                value={state[p.id] as string}
                                                onChange={e => updateState(p.id, e.target.value)}
                                                className="template-builder__input"
                                            />
                                            {p.description && renderDescription(p.description)}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {/* Boolean checkboxes */}
                            {catBools.length > 0 && (
                                <div className="template-builder__checkboxes">
                                    {catBools.map(p => (
                                        <label
                                            key={p.id}
                                            className={`template-builder__card${state[p.id] ? ' template-builder__card--selected' : ''}`}
                                            title={p.description}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={!!state[p.id]}
                                                onChange={e => updateState(p.id, e.target.checked)}
                                                className="template-builder__checkbox"
                                            />
                                            <span className="template-builder__checkmark" />
                                            <span className="template-builder__card-text">
                                                <span className="template-builder__label">{p.label}</span>
                                                {p.version && (
                                                    <span className="template-builder__version">{p.version}</span>
                                                )}
                                                {p.description && (
                                                    <span className="template-builder__desc">{linkify(p.description)}</span>
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}

            {/* Download button */}
            <div className="template-builder__actions">
                <button
                    className="template-builder__btn template-builder__btn--primary"
                    onClick={handleDownload}
                    disabled={generating}
                >
                    {generating ? 'Generating...' : 'Download Project (.zip)'}
                </button>
                <button
                    className="template-builder__btn template-builder__btn--secondary"
                    onClick={() => setState(getDefaultState())}
                >
                    Reset to Defaults
                </button>
            </div>
        </div>
    );
};

export default TemplateBuilder;
