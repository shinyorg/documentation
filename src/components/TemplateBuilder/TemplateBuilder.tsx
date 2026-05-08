import { useState, useCallback } from 'react';
import React from 'react';
import { TEMPLATE_PARAMS, CATEGORIES, getDefaultState, type TemplateState } from './templateData';
import { generateProject } from './generateProject';

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

    const choiceParams = TEMPLATE_PARAMS.filter(p => p.type === 'choice');
    const stringParams = TEMPLATE_PARAMS.filter(p => p.type === 'string');
    const boolParams = TEMPLATE_PARAMS.filter(p => p.type === 'bool');

    const isVisible = (p: { visibleWhen?: (state: TemplateState) => boolean }) =>
        !p.visibleWhen || p.visibleWhen(state);

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
                    {/* Choice dropdowns */}
                    {choiceParams.filter(p => p.category === 'project').map(p => (
                        <label key={p.id} className="template-builder__input-group">
                            <span className="template-builder__input-label">{p.label}</span>
                            <select
                                value={state[p.id] as string}
                                onChange={e => updateState(p.id, e.target.value)}
                                className="template-builder__select"
                            >
                                {p.choices!.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </label>
                    ))}
                </div>
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
                            {/* Dropdowns */}
                            {catChoices.length > 0 && (
                                <div className="template-builder__inputs">
                                    {catChoices.map(p => (
                                        <label key={p.id} className="template-builder__input-group">
                                            <span className="template-builder__input-label">{p.label}</span>
                                            <select
                                                value={state[p.id] as string}
                                                onChange={e => updateState(p.id, e.target.value)}
                                                className="template-builder__select"
                                            >
                                                {p.choices!.map(c => (
                                                    <option key={c.value} value={c.value}>{c.label}</option>
                                                ))}
                                            </select>
                                        </label>
                                    ))}
                                </div>
                            )}
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
                                        >
                                            <input
                                                type="checkbox"
                                                checked={!!state[p.id]}
                                                onChange={e => updateState(p.id, e.target.checked)}
                                                className="template-builder__checkbox"
                                            />
                                            <span className="template-builder__checkmark" />
                                            <span className="template-builder__label">{p.label}</span>
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
