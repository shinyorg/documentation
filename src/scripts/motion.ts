/**
 * Scroll-linked motion for the homepage. Styles live in src/styles/motion.css; both are pulled in
 * by src/components/HomeMotion.astro. Ported from the shinysoft.biz motion system so the two sites
 * move the same way.
 *
 * Markup opts in with attributes rather than classes, so intent reads in the template:
 *
 *   data-reveal="up|down|left|right|scale|blur|mask|fade|split"   entrance when scrolled into view
 *   data-reveal-delay="200"                                       ms before it starts
 *   data-reveal-hold="1000"                                       extra ms to keep the reveal state, for
 *                                                                 entrances with longer inner choreography
 *   data-stagger="up" (+ data-stagger-step="70")                  reveal each child in sequence
 *   data-parallax="-0.15"                                         vertical drift against the scroll
 *   data-depth="18"                                               drift toward the pointer, in px
 *   data-countup                                                  count "40M+" up from zero on reveal
 *   data-velocity                                                 CSS marquees speed up with scrolling
 *                                                                 and run backwards when scrolling up
 *   data-spotlight                                                soft light that follows the cursor,
 *                                                                 or is pinned under the finger on touch
 *
 * `data-countup` rather than shinysoft's `data-count`: the hero already owns `data-count` for its
 * own fact counters.
 *
 * Nothing runs unless HomeMotion.astro's inline script added `html.motion` — that is where
 * prefers-reduced-motion is honoured.
 */

const root = document.documentElement;
const motion = root.classList.contains('motion');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------------------------------------------------------------- helpers */

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------------------------------------------------------- split words */

/** Wraps every word in a clipped slot, preserving nested markup (links, <br>). */
function splitWords(el: HTMLElement) {
  if (el.dataset.split === 'done') return;
  el.dataset.split = 'done';
  let index = 0;

  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) continue;
        const frag = document.createDocumentFragment();
        for (const part of text.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            continue;
          }
          const word = document.createElement('span');
          word.className = 'split-word';
          const inner = document.createElement('span');
          inner.className = 'split-inner';
          inner.style.setProperty('--w', String(index++));
          inner.textContent = part;
          word.appendChild(inner);
          frag.appendChild(word);
        }
        child.replaceWith(frag);
      } else if (child instanceof HTMLElement && child.tagName !== 'BR' && child.tagName !== 'SVG') {
        walk(child);
      }
    }
  };

  walk(el);
}

/* ------------------------------------------------------------ counters */

function countUp(el: HTMLElement) {
  if (el.dataset.counted || el.dataset.countFinal === undefined) return;
  el.dataset.counted = 'true';
  const final = el.dataset.countFinal;
  const match = final.match(/^(\D*)([\d,.]+)(.*)$/);
  if (!match) return;
  const [, prefix, digits, suffix] = match;
  const target = parseFloat(digits.replace(/,/g, ''));
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
  const duration = 1800;
  const start = performance.now();

  const tick = (now: number) => {
    const t = clamp((now - start) / duration, 0, 1);
    // easeOutExpo: most of the climb happens fast, then it settles onto the real number.
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const value = (target * eased).toFixed(decimals);
    el.textContent = `${prefix}${Number(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      useGrouping: digits.includes(','),
    })}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  requestAnimationFrame(tick);
  // rAF stops in background tabs; never leave a figure stranded part-way up.
  window.setTimeout(() => (el.textContent = final), duration + 200);
}

function primeCounter(el: HTMLElement) {
  // Nested reveals can reach the same counter twice; priming again would record "0M+" as final.
  if (el.dataset.countFinal !== undefined) return;
  const final = el.textContent ?? '';
  el.dataset.countFinal = final;
  // Screen readers get the real figure, not a number mid-climb.
  el.setAttribute('aria-label', final.trim());
  el.textContent = final.replace(/[\d,.]+/, (d) => (d.includes('.') ? '0.0' : '0'));
}

/* ----------------------------------------------------------- reveals */

const REVEAL_TIME = 1300;

function onRevealed(el: HTMLElement) {
  el.classList.add('is-in');
  el.querySelectorAll<HTMLElement>('[data-countup]').forEach(countUp);
  if (el.hasAttribute('data-countup')) countUp(el);

  // Hand the element back to its own transitions (card hovers, button lifts) once the entrance
  // is over. Split headings keep theirs — their words carry the transition, not the element.
  if (el.dataset.reveal !== 'split') {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--reveal-delay')) || 0;
    const hold = Number(el.dataset.revealHold) || 0;
    window.setTimeout(() => {
      el.removeAttribute('data-reveal');
      el.style.removeProperty('--reveal-delay');
    }, REVEAL_TIME + delay + hold);
  }
}

const revealObserver = motion
  ? new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealObserver!.unobserve(entry.target);
          onRevealed(entry.target as HTMLElement);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    )
  : null;

function registerReveal(el: HTMLElement) {
  if (el.dataset.revealDelay) el.style.setProperty('--reveal-delay', `${el.dataset.revealDelay}ms`);
  if (el.dataset.reveal === 'split') splitWords(el);
  el.querySelectorAll<HTMLElement>('[data-countup]').forEach(primeCounter);
  revealObserver!.observe(el);
}

function registerStagger(container: HTMLElement) {
  const variant = container.dataset.stagger || 'up';
  const step = Number(container.dataset.staggerStep) || 70;
  const base = Number(container.dataset.revealDelay) || 0;
  Array.from(container.children).forEach((child, i) => {
    const el = child as HTMLElement;
    if (!el.dataset.reveal) el.dataset.reveal = variant;
    // Capped, so the twelfth card in a grid does not wait a second and a half.
    el.style.setProperty('--reveal-delay', `${base + Math.min(i, 12) * step}ms`);
    if (el.dataset.reveal === 'split') splitWords(el);
    el.querySelectorAll<HTMLElement>('[data-countup]').forEach(primeCounter);
    revealObserver!.observe(el);
  });
}

/* ------------------------------------------------- parallax + pointer */

interface Drifter {
  el: HTMLElement;
  speed: number;
  depth: number;
  visible: boolean;
  px: number;
  py: number;
}

const drifters: Drifter[] = [];
let pointerX = 0;
let pointerY = 0;

const drifterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const d = drifters.find((x) => x.el === entry.target);
      if (d) d.visible = entry.isIntersecting;
    }
  },
  { rootMargin: '20% 0px' },
);

function registerDrifters() {
  document.querySelectorAll<HTMLElement>('[data-parallax], [data-depth]').forEach((el) => {
    const d: Drifter = {
      el,
      speed: parseFloat(el.dataset.parallax ?? '0') || 0,
      depth: finePointer ? parseFloat(el.dataset.depth ?? '0') || 0 : 0,
      visible: false,
      px: 0,
      py: 0,
    };
    drifters.push(d);
    drifterObserver.observe(el);
  });
}

/* -------------------------------------------------- marquee velocity */

let velocityTargets: Animation[] = [];
let smoothedVelocity = 0;

function collectVelocityTargets() {
  velocityTargets = [];
  document.querySelectorAll<HTMLElement>('[data-velocity]').forEach((host) => {
    host.getAnimations({ subtree: true }).forEach((a) => {
      // Only the endless belts — not a card's one-shot hover transition.
      if (a instanceof CSSAnimation) velocityTargets.push(a);
    });
  });
}

/* ------------------------------------------------------------ frame */

const progressBar = document.querySelector<HTMLElement>('.scroll-progress');
let lastScrollY = window.scrollY;
let lastTime = performance.now();

function frame(now: number) {
  const vh = window.innerHeight;
  const scrollY = window.scrollY;
  const dt = Math.max(1, now - lastTime);
  const rawVelocity = (scrollY - lastScrollY) / dt; // px per ms
  lastScrollY = scrollY;
  lastTime = now;
  smoothedVelocity = lerp(smoothedVelocity, rawVelocity, 0.12);

  if (progressBar) {
    const max = document.documentElement.scrollHeight - vh;
    progressBar.style.setProperty('--progress', String(max > 0 ? clamp(scrollY / max, 0, 1) : 0));
  }

  // Read every rect first, then write, so the browser lays out once per frame.
  const reads = drifters.map((d) => (d.visible ? d.el.getBoundingClientRect() : null));
  drifters.forEach((d, i) => {
    const rect = reads[i];
    if (!rect) return;
    const centre = rect.top - d.py + rect.height / 2;
    const targetY = (centre - vh / 2) * d.speed + pointerY * d.depth;
    const targetX = pointerX * d.depth;
    d.py = lerp(d.py, targetY, 0.14);
    d.px = lerp(d.px, targetX, 0.08);
    d.el.style.setProperty('--py', `${d.py.toFixed(2)}px`);
    d.el.style.setProperty('--px', `${d.px.toFixed(2)}px`);
  });

  if (velocityTargets.length) {
    // Scrolling down speeds the belt up; scrolling up throws it into reverse.
    const boost = clamp(smoothedVelocity * 3, -6, 6);
    const rate = Math.abs(boost) < 0.05 ? 1 : boost > 0 ? 1 + boost : Math.min(-1, boost);
    for (const a of velocityTargets) {
      if (a.playState !== 'paused') a.playbackRate = rate;
    }
  }

  requestAnimationFrame(frame);
}

/* ----------------------------------------------------------- spotlight */

function initSpotlight() {
  document.addEventListener(
    'pointermove',
    (e) => {
      pointerX = e.clientX / window.innerWidth - 0.5;
      pointerY = e.clientY / window.innerHeight - 0.5;

      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-spotlight]');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      target.style.setProperty('--my', `${e.clientY - rect.top}px`);
    },
    { passive: true },
  );
}

/* ----------------------------------------------------- touch spotlight */

/**
 * Touch has no hover position, so the light is pinned where the finger lands instead, in
 * viewport coordinates. Cards pick it up under the finger, then glide beneath that fixed point
 * as the page coasts after a flick, and the glow fades once scrolling settles.
 */
function initTouchSpotlight() {
  // How far outside a card's edge the light still reaches it, so the glow slides in, not pops.
  const REACH = 120;
  const SETTLE = 240;
  const visible = new Set<HTMLElement>();
  const lit = new Set<HTMLElement>();
  let lightX = 0;
  let lightY = 0;
  let touching = false;
  let queued = false;
  let idleTimer = 0;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(el);
      else visible.delete(el);
    }
  });
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) => observer.observe(el));

  const paint = () => {
    queued = false;
    for (const el of visible) {
      const rect = el.getBoundingClientRect();
      const x = lightX - rect.left;
      const y = lightY - rect.top;
      const near = x > -REACH && x < rect.width + REACH && y > -REACH && y < rect.height + REACH;
      if (near) {
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        if (!lit.has(el)) {
          lit.add(el);
          el.classList.add('is-lit');
        }
      } else if (lit.has(el)) {
        // Leave --mx/--my where they were so the glow fades in place rather than jumping.
        lit.delete(el);
        el.classList.remove('is-lit');
      }
    }
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(paint);
  };

  const settle = () => {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      if (touching) return;
      lit.forEach((el) => el.classList.remove('is-lit'));
      lit.clear();
    }, SETTLE);
  };

  const follow = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    lightX = t.clientX;
    lightY = t.clientY;
    schedule();
  };

  document.addEventListener(
    'touchstart',
    (e) => {
      touching = true;
      window.clearTimeout(idleTimer);
      follow(e);
    },
    { passive: true },
  );
  document.addEventListener('touchmove', follow, { passive: true });

  const release = (e: TouchEvent) => {
    touching = e.touches.length > 0;
    settle();
  };
  document.addEventListener('touchend', release, { passive: true });
  document.addEventListener('touchcancel', release, { passive: true });

  // Momentum scrolling carries on after the finger lifts; keep lighting cards as they pass.
  window.addEventListener(
    'scroll',
    () => {
      if (!touching && !lit.size) return;
      schedule();
      settle();
    },
    { passive: true },
  );
}

/* --------------------------------------------------------------- boot */

function boot() {
  if (finePointer) {
    root.classList.add('can-hover');
    initSpotlight();
  } else if (motion) {
    root.classList.add('can-touch');
    initTouchSpotlight();
  }

  if (!motion) return;

  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach(registerStagger);
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    // Stagger children were registered above.
    if (!el.parentElement?.hasAttribute('data-stagger')) registerReveal(el);
  });
  document.querySelectorAll<HTMLElement>('[data-countup]:not([data-count-final])').forEach((el) => {
    // A counter outside any reveal still wants to climb when it scrolls into view.
    if (el.closest('[data-reveal], [data-stagger]')) return;
    primeCounter(el);
    el.dataset.reveal = 'fade';
    revealObserver!.observe(el);
  });

  registerDrifters();
  collectVelocityTargets();

  (window as unknown as { __motion: boolean }).__motion = true;
  requestAnimationFrame(frame);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
