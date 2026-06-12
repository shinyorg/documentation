// Port of tools/ShinyThemeGen/ColorMath.cs — keep in sync with the C# generator so themes
// authored here produce byte-identical output to `dotnet run --project tools/ShinyThemeGen`.

// C# Math.Round uses banker's rounding (MidpointRounding.ToEven); replicate it for parity.
function bankersRound(x: number): number {
    const f = Math.floor(x);
    const diff = x - f;
    if (diff < 0.5) return f;
    if (diff > 0.5) return f + 1;
    return f % 2 === 0 ? f : f + 1;
}

export function parseHex(hex: string): [number, number, number] {
    const h = hex.replace(/^#/, '');
    return [
        parseInt(h.substring(0, 2), 16),
        parseInt(h.substring(2, 4), 16),
        parseInt(h.substring(4, 6), 16),
    ];
}

function toHex(r: number, g: number, b: number): string {
    const clamp = (v: number) => bankersRound(Math.min(255, Math.max(0, v)));
    const hx = (v: number) => clamp(v).toString(16).toUpperCase().padStart(2, '0');
    return `#${hx(r)}${hx(g)}${hx(b)}`;
}

function srgbToLinear(c: number): number {
    c /= 255.0;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
    const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055;
    return v * 255.0;
}

// D65 reference white
const Xn = 0.95047, Yn = 1.0, Zn = 1.08883;

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
    const rl = srgbToLinear(r);
    const gl = srgbToLinear(g);
    const bl = srgbToLinear(b);

    const x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / Xn;
    const y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750) / Yn;
    const z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) / Zn;

    const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16.0 / 116.0);
    const fx = f(x), fy = f(y), fz = f(z);

    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function labToHex(l: number, a: number, bb: number): string {
    const fy = (l + 16) / 116.0;
    const fx = fy + a / 500.0;
    const fz = fy - bb / 200.0;

    const inv = (t: number) => {
        const t3 = t * t * t;
        return t3 > 0.008856 ? t3 : (t - 16.0 / 116.0) / 7.787;
    };

    const x = inv(fx) * Xn;
    const y = inv(fy) * Yn;
    const z = inv(fz) * Zn;

    const rl = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
    const gl = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
    const bl = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

    return toHex(linearToSrgb(rl), linearToSrgb(gl), linearToSrgb(bl));
}

/** A tonal palette derived from a seed: keeps hue/chroma, varies tone (L*). */
export class TonalPalette {
    private constructor(private readonly hueRad: number, private readonly chroma: number) {}

    static fromSeed(hex: string): TonalPalette {
        const [r, g, b] = parseHex(hex);
        const [, a, bb] = rgbToLab(r, g, b);
        const hue = Math.atan2(bb, a);
        const chroma = Math.sqrt(a * a + bb * bb);
        return new TonalPalette(hue, chroma);
    }

    /** Returns the hex for the given tone (0 = black .. 100 = white). */
    tone(tone: number): string {
        // Taper chroma toward the lightness extremes so tone 100 -> white and tone 0 -> black.
        let factor: number;
        if (tone >= 90) factor = Math.max(0, (100 - tone) / 10.0);
        else if (tone <= 10) factor = Math.max(0, tone / 10.0);
        else factor = 1.0;

        const c = this.chroma * factor;
        const a = c * Math.cos(this.hueRad);
        const b = c * Math.sin(this.hueRad);
        return labToHex(tone, a, b);
    }
}
