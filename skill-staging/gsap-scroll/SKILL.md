---
name: gsap-scroll
description: Build, debug, or refine scroll-driven web interactions with GSAP ScrollTrigger, ScrollSmoother, Observer, or ScrollToPlugin. Use for scrubbed timelines, pinning, snapping, scroll-linked storytelling, smooth scrolling, gesture-driven sections, and programmatic scrolling; do not activate for ordinary non-scroll animation.
---

# GSAP Scroll

Create a polished interaction that fits the existing stack and remains usable without motion.

## Workflow

1. Inspect the existing animation setup, package manager, scrolling container, layout, and every caller or component affected. Follow repository instructions and local framework docs before editing framework code.
2. Confirm GSAP is warranted. Use CSS `position: sticky`, scroll snap, or an Intersection Observer for simple behavior; use GSAP when the request needs sequencing, precise scrub control, pinning, synchronized transforms, or cross-browser orchestration.
3. Choose the smallest relevant GSAP tool. Read [references/scroll-toolkit.md](references/scroll-toolkit.md) when selecting APIs or implementing framework lifecycle, responsive behavior, smooth scrolling, gestures, or navigation.
4. Reuse the installed GSAP setup. Add only `gsap`, and `@gsap/react` for React lifecycle integration when it is actually needed. Do not add a second smooth-scroll or animation library.
5. Build one timeline per coherent scene. Keep layout/state ownership in the component that renders it, scope selectors to that component, and use GSAP context cleanup rather than global selectors or manual bookkeeping.
6. Verify scrolling in both directions, refresh/resizing, mobile layout, keyboard navigation, reduced motion, and route/component teardown. Use temporary `markers: true` only while diagnosing and remove them before delivery.

## Non-negotiables

- Register only imported plugins and do so in client-executed code.
- Animate transforms and opacity where possible; avoid per-frame React state updates and layout-thrashing callbacks.
- Do not hide essential content before JavaScript is ready. Preserve reading order, focus order, anchors, and native scrolling semantics.
- Treat pinning and smooth scrolling as progressive enhancement. Avoid trapping wheel, touch, or keyboard input unless the requested interaction truly requires Observer-based control and has an accessible fallback.
- Honor `prefers-reduced-motion`: remove scrubbed/parallax motion or present the final readable state, while keeping navigation functional.
- Recalculate measurements after fonts, images, and layout changes when necessary; do not scatter unconditional `ScrollTrigger.refresh()` calls.
- Kill contexts, triggers, observers, and smoothers created by the component on teardown. Do not use `ScrollTrigger.killAll()` in application components.
- Consult the current official GSAP docs before relying on unfamiliar options or plugin behavior: <https://gsap.com/scroll/> and <https://gsap.com/docs/v3/>.

## Delivery

Report which GSAP tools were used, where the interaction lives, how reduced motion behaves, and the exact verification performed. Keep the explanation shorter than the implementation warrants.
