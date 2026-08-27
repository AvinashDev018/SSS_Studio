## 2024-08-27 - Lightbox Focus Management
**Learning:** Moving keyboard event listeners from the global `window` object to specific modal components (like a lightbox) improves focus trapping, avoids global event conflicts, and ensures screen reader users explicitly know when they are interacting within a modal context.
**Action:** Always ensure modals/lightboxes have `tabIndex={0}`, automatically gain focus upon opening (via `ref.current.focus()`), and manage their own keyboard events (Esc, Arrow keys) rather than relying on global window listeners.
