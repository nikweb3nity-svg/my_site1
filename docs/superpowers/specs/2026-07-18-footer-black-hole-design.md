# Footer black-hole particle form

## Goal

Replace the sparse footer vortex with a dimensional black-hole form built from the existing outlined triangle particles.

## Visual design

The desktop footer target is an asymmetric accretion ring on the right side of the final contact section. A deliberately empty, dark centre creates the sense of depth. The particle density is highest on the near edge of the ring, then breaks into two thinner, uneven inner and outer streams. A small amount of ambient debris continues beyond the outer stream.

The current particle palette, outlined triangular renderer and black background remain unchanged. No glow, gradients, solid geometric lines or new colours are introduced.

## Motion

The existing WebGL time signal offsets each layer with a distinct slow angular drift. The motion is subtle and continuous: the dense near edge appears to circulate around the empty centre, while the outer debris drifts more slowly. There is no cursor interaction for this footer-only shape.

## Scope

- Replace only the `createVortexShape` target geometry and add footer-specific vertex-shader motion.
- Preserve the existing scroll transition, particle count, text-exclusion system, initial sphere cursor reaction, palette and rendering method.
- Keep the existing mobile geometry untouched.

## Verification

- Add or update a static source check for the black-hole geometry and its layered motion.
- Run all existing checks.
- Visually verify the local desktop footer: readable copy, a clearly dark centre, dense layered particle bands and no smooth spiral or glow.
