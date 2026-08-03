import Prism from 'prismjs';

// `prismjs/components/prism-*.js` are plain scripts that read the *global* `Prism`.
// Rollup wraps the prismjs core as a lazy CommonJS factory, so in a production build the
// component IIFE can run before the core has ever been evaluated — the global is still
// undefined and the chunk dies with `ReferenceError: Prism is not defined`, which aborts
// hydration for the entire island (the App Builder renders but nothing responds to input).
//
// Importing this module forces the core to evaluate (which sets `window.Prism` itself) and
// publishes the global defensively. Always import Prism from here, and keep the
// `prismjs/components/*` imports *after* it so the evaluation order is guaranteed:
//
//   import Prism from '../prism';
//   import 'prismjs/components/prism-csharp';
if (typeof globalThis !== 'undefined') {
    (globalThis as unknown as { Prism?: unknown }).Prism = Prism;
}

export default Prism;
