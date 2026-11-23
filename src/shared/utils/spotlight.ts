import type { PointerEvent } from 'react';

/**
 * onPointerMove handler for elements with the `spotlight` SCSS mixin:
 * passes the cursor position inside the element to CSS variables.
 */
function handleSpotlightMove(event: PointerEvent<HTMLElement>) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();

  element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
  element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
}

export default handleSpotlightMove;
