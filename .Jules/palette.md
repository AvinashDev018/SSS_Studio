## 2024-08-27 - Lightbox Focus Management
**Learning:** Moving keyboard event listeners from the global `window` object to specific modal components (like a lightbox) improves focus trapping, avoids global event conflicts, and ensures screen reader users explicitly know when they are interacting within a modal context.
**Action:** Always ensure modals/lightboxes have `tabIndex={0}`, automatically gain focus upon opening (via `ref.current.focus()`), and manage their own keyboard events (Esc, Arrow keys) rather than relying on global window listeners.

## 2024-08-30 - Custom Selection Controls & ARIA States
**Learning:** When building custom selection controls (like selectable package cards, time slots, or event type chips), relying only on CSS classes for visual state (like borders and gradients) hides the selection state from screen reader users. Furthermore, using a `div` with an `onClick` for custom interactive cards prevents keyboard users from focusing and activating them.
**Action:** Always use semantic `<button>` elements for custom selectable cards to get keyboard focus and activation for free. Combine this with appropriate ARIA attributes (e.g., `aria-pressed={isActive}`) on all selection buttons so screen readers announce their selected state context.

## 2024-11-20 - Skeleton Loaders and Layout Shifts
**Learning:** High-resolution galleries can cause significant, disjointed layout shifts as large image files stream in or the backend resolves database requests. Without placeholder structure, the UI can collapse or jump around unexpectedly, confusing the user and breaking visual continuity. Adding animated skeletons properly structured using the final grid layout ensures visual stability.
**Action:** Always use skeleton loaders (using `animate-pulse` or similar patterns) structured exactly like the final target grid/layout when loading async images or grid data. Wait for data to resolve completely before swapping from skeletons to content.
