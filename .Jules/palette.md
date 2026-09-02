## 2024-08-27 - Lightbox Focus Management
**Learning:** Moving keyboard event listeners from the global `window` object to specific modal components (like a lightbox) improves focus trapping, avoids global event conflicts, and ensures screen reader users explicitly know when they are interacting within a modal context.
**Action:** Always ensure modals/lightboxes have `tabIndex={0}`, automatically gain focus upon opening (via `ref.current.focus()`), and manage their own keyboard events (Esc, Arrow keys) rather than relying on global window listeners.

## 2024-08-30 - Custom Selection Controls & ARIA States
**Learning:** When building custom selection controls (like selectable package cards, time slots, or event type chips), relying only on CSS classes for visual state (like borders and gradients) hides the selection state from screen reader users. Furthermore, using a `div` with an `onClick` for custom interactive cards prevents keyboard users from focusing and activating them.
**Action:** Always use semantic `<button>` elements for custom selectable cards to get keyboard focus and activation for free. Combine this with appropriate ARIA attributes (e.g., `aria-pressed={isActive}`) on all selection buttons so screen readers announce their selected state context.

## 2024-11-20 - Adding ARIA Labels to Icon-Only Buttons
**Learning:** Icon-only buttons used for actions such as hiding or deleting items need to have `aria-label` attributes so screen reader users understand their purpose.
**Action:** Always add an appropriate `aria-label` string to buttons that use an icon but contain no text.
