import { useState, useRef, useEffect, useCallback } from 'react';
import React from 'react';

export interface DropdownOption {
    value: string;
    label: string;
    description?: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    label: string;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={`tb-dropdown__chevron${open ? ' tb-dropdown__chevron--open' : ''}`}
    >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Dropdown = ({ options, value, onChange, label }: DropdownProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find(o => o.value === value);

    const handleSelect = useCallback((val: string) => {
        onChange(val);
        setOpen(false);
    }, [onChange]);

    // Close on click outside
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open]);

    return (
        <div className="tb-dropdown" ref={ref}>
            <span className="tb-dropdown__label">{label}</span>
            <button
                type="button"
                className={`tb-dropdown__trigger${open ? ' tb-dropdown__trigger--open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="tb-dropdown__value">{selected?.label ?? value}</span>
                <ChevronIcon open={open} />
            </button>
            {open && (
                <ul className="tb-dropdown__menu" role="listbox">
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            role="option"
                            aria-selected={opt.value === value}
                            className={`tb-dropdown__item${opt.value === value ? ' tb-dropdown__item--selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            <span className="tb-dropdown__item-label">{opt.label}</span>
                            {opt.value === value && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="tb-dropdown__check">
                                    <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
