# GSAP scroll toolkit

Read only the sections relevant to the requested interaction. Verify unfamiliar options against the current official documentation because GSAP APIs and packaging can change.

## Choose the tool

| Need | Tool | Notes |
| --- | --- | --- |
| Trigger, scrub, pin, snap, callbacks, progress | `ScrollTrigger` | Default choice for scroll-linked scenes. Attach it to a tween or timeline. |
| Smooth the document while keeping ScrollTrigger integration | `ScrollSmoother` | Use only when smooth scrolling is explicitly valuable. It requires the documented wrapper/content structure. |
| Normalize wheel/touch/pointer gestures or build deliberate section stepping | `Observer` | Use sparingly; do not casually replace native page scrolling. |
| Animate the window or a container to a position/element | `ScrollToPlugin` | Preserve focus and URL/anchor semantics for navigation. |
| Scroll-driven text or SVG choreography | `SplitText`, `DrawSVGPlugin`, `MorphSVGPlugin`, core GSAP | Optional companions, not substitutes for ScrollTrigger. Use only when the design asks for them. |

Official references:

- Scroll overview: <https://gsap.com/scroll/>
- ScrollTrigger: <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>
- ScrollSmoother: <https://gsap.com/docs/v3/Plugins/ScrollSmoother/>
- Observer: <https://gsap.com/docs/v3/Plugins/Observer/>
- ScrollToPlugin: <https://gsap.com/docs/v3/Plugins/ScrollToPlugin/>
- React integration: <https://gsap.com/resources/React/>

## ScrollTrigger decisions

- Use semantic trigger elements and explicit `start`/`end` values. Prefer values that still make sense when copy wraps or viewport height changes.
- Use `scrub: true` for direct coupling or a small numeric scrub for catch-up smoothing. Do not add scrub merely because an animation happens near scrolling.
- Pin the smallest stable wrapper. Check the space before and after it, nested transforms, and whether `pinSpacing` is genuinely unwanted.
- Use `snap` only when landing points improve comprehension. Ensure users can still reach every section and reverse direction naturally.
- Use a single timeline when several elements share one progress value. Use separate triggers when their lifecycles are independent.
- Prefer `batch()` for many repeated reveal items. Prefer `matchMedia()` for materially different desktop/mobile scenes.
- Use `containerAnimation` for triggers inside a horizontally translated timeline. Follow its documented constraints rather than calculating fake scroll positions.
- For custom scrolling containers, set `scroller` consistently. Use `scrollerProxy()` only for a third-party virtual scroller that cannot integrate directly.

## React and Next.js lifecycle

Use a client boundary only around the interactive component, not the whole page. Keep DOM refs local and scope GSAP work with `useGSAP`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Scene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 30%", scrub: true },
    }).from("[data-reveal]", { y: 40, autoAlpha: 0, stagger: 0.08 });
  }, { scope: root });

  return <section ref={root}><div data-reveal>...</div></section>;
}
```

For reactive inputs, use `dependencies` and `revertOnUpdate` only when rebuilding is intended. Wrap later event-handler animation work with `contextSafe`. Do not create triggers during render.

Before writing Next.js code, read the repository's installed Next.js guidance as required by its `AGENTS.md`; do not rely on remembered conventions.

## Responsive and accessibility behavior

Use `gsap.matchMedia()` to keep reduced-motion and breakpoint behavior next to the animation it changes. A useful policy is:

- no preference: run the intended scene;
- reduced motion: remove scrub/parallax, shorten or eliminate transitions, and immediately expose readable content;
- narrow screens: reduce travel distance and pin duration, or replace complex horizontal/pinned scenes with normal document flow.

Pinned content must not cover focus indicators or strand keyboard users. If a control scrolls to content, update focus when appropriate and retain a meaningful anchor destination.

## ScrollSmoother and Observer

Create at most one document-level `ScrollSmoother`. Reuse it across page features and tear it down only where application ownership requires it. Do not combine it with another smooth-scroll engine.

Observer-based section stepping needs explicit escape conditions, bounded indexes, touch/wheel debouncing, reverse navigation, and a normal-flow fallback. Ignore gestures originating in interactive controls when interception would break them.

## Debug and verification

Check at least:

1. first load at the top and at a deep link;
2. slow and fast scroll in both directions;
3. viewport resize/orientation change and late-loading images/fonts;
4. touch-sized viewport plus keyboard/focus navigation;
5. reduced motion and component/route teardown.

Common causes of drift or jumps are unstable layout, an incorrect scroller, transformed ancestors around pinned elements, competing CSS transitions, and refresh timing. Fix the owning layout or lifecycle instead of adding magic offsets.
