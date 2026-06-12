// Port of tools/ShinyThemeGen/SchemeBuilder.cs

import { TonalPalette } from './colorMath';
import { COLOR_ROLES, type Seeds } from './tokens';

export interface Palettes {
    primary: TonalPalette;
    secondary: TonalPalette;
    tertiary: TonalPalette;
    neutral: TonalPalette;
    neutralVariant: TonalPalette;
    error: TonalPalette;
    success: TonalPalette;
    info: TonalPalette;
    warning: TonalPalette;
    caution: TonalPalette;
    critical: TonalPalette;
}

export function palettesFromSeeds(s: Seeds): Palettes {
    return {
        primary: TonalPalette.fromSeed(s.primary),
        secondary: TonalPalette.fromSeed(s.secondary),
        tertiary: TonalPalette.fromSeed(s.tertiary),
        neutral: TonalPalette.fromSeed(s.neutral),
        neutralVariant: TonalPalette.fromSeed(s.neutralVariant),
        error: TonalPalette.fromSeed(s.error),
        success: TonalPalette.fromSeed(s.success),
        info: TonalPalette.fromSeed(s.info),
        warning: TonalPalette.fromSeed(s.warning),
        caution: TonalPalette.fromSeed(s.caution),
        critical: TonalPalette.fromSeed(s.critical),
    };
}

/** Builds the full role->hex map for a scheme, in COLOR_ROLES order. */
export function buildScheme(p: Palettes, dark: boolean): [string, string][] {
    const map: Record<string, string> = {};

    const accent = (prefix: string, tp: TonalPalette) => {
        if (!dark) {
            map[prefix] = tp.tone(40);
            map['On' + prefix] = tp.tone(100);
            map[prefix + 'Container'] = tp.tone(90);
            map['On' + prefix + 'Container'] = tp.tone(10);
        } else {
            map[prefix] = tp.tone(80);
            map['On' + prefix] = tp.tone(20);
            map[prefix + 'Container'] = tp.tone(30);
            map['On' + prefix + 'Container'] = tp.tone(90);
        }
    };

    accent('Primary', p.primary);
    accent('Secondary', p.secondary);
    accent('Tertiary', p.tertiary);
    accent('Error', p.error);
    accent('Success', p.success);
    accent('Info', p.info);
    accent('Warning', p.warning);
    accent('Caution', p.caution);
    accent('Critical', p.critical);

    if (!dark) {
        map['Background'] = p.neutral.tone(98);
        map['OnBackground'] = p.neutral.tone(10);
        map['Surface'] = p.neutral.tone(98);
        map['OnSurface'] = p.neutral.tone(10);
        map['SurfaceVariant'] = p.neutralVariant.tone(90);
        map['OnSurfaceVariant'] = p.neutralVariant.tone(30);
        map['SurfaceContainerLowest'] = p.neutral.tone(100);
        map['SurfaceContainerLow'] = p.neutral.tone(96);
        map['SurfaceContainer'] = p.neutral.tone(94);
        map['SurfaceContainerHigh'] = p.neutral.tone(92);
        map['SurfaceContainerHighest'] = p.neutral.tone(90);
        map['SurfaceTint'] = p.primary.tone(40);
        map['Outline'] = p.neutralVariant.tone(50);
        map['OutlineVariant'] = p.neutralVariant.tone(80);
        map['InverseSurface'] = p.neutral.tone(20);
        map['InverseOnSurface'] = p.neutral.tone(95);
        map['InversePrimary'] = p.primary.tone(80);
    } else {
        map['Background'] = p.neutral.tone(6);
        map['OnBackground'] = p.neutral.tone(90);
        map['Surface'] = p.neutral.tone(6);
        map['OnSurface'] = p.neutral.tone(90);
        map['SurfaceVariant'] = p.neutralVariant.tone(30);
        map['OnSurfaceVariant'] = p.neutralVariant.tone(80);
        map['SurfaceContainerLowest'] = p.neutral.tone(4);
        map['SurfaceContainerLow'] = p.neutral.tone(10);
        map['SurfaceContainer'] = p.neutral.tone(12);
        map['SurfaceContainerHigh'] = p.neutral.tone(17);
        map['SurfaceContainerHighest'] = p.neutral.tone(22);
        map['SurfaceTint'] = p.primary.tone(80);
        map['Outline'] = p.neutralVariant.tone(60);
        map['OutlineVariant'] = p.neutralVariant.tone(30);
        map['InverseSurface'] = p.neutral.tone(90);
        map['InverseOnSurface'] = p.neutral.tone(20);
        map['InversePrimary'] = p.primary.tone(40);
    }

    map['Shadow'] = p.neutral.tone(0);
    map['Scrim'] = p.neutral.tone(0);

    return COLOR_ROLES.map((role) => [role, map[role]] as [string, string]);
}
