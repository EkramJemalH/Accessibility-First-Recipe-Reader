/**
 * useFocusTrap — traps Tab/Shift+Tab focus within a container element.
 *
 * Requirements: 13.3, 13.4
 *
 * Usage:
 *   const containerRef = useRef<HTMLDivElement>(null)
 *   const triggerRef = useRef<HTMLButtonElement>(null)
 *   useFocusTrap(containerRef, isOpen, triggerRef)
 *
 * When `active` becomes true:
 *   - Focus is moved to the first focusable element inside the container.
 *   - Tab and Shift+Tab are intercepted to cycle within the container.
 *
 * When `active` becomes false:
 *   - Focus is returned to the `triggerRef` element (the element that opened
 *     the modal), satisfying Requirement 13.4.
 *   - The keydown listener is removed.
 */

import { useEffect, RefObject } from 'react'

/** CSS selector that matches all natively focusable elements. */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(', ')

/**
 * Returns all focusable elements inside `container`, in DOM order.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]'),
  )
}

/**
 * Traps keyboard focus within `containerRef` while `active` is true.
 *
 * @param containerRef - Ref to the modal/dialog container element.
 * @param active       - Whether the trap is currently active.
 * @param triggerRef   - Optional ref to the element that triggered the modal.
 *                       Focus is returned here when `active` becomes false.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  triggerRef?: RefObject<HTMLElement | null>,
): void {
  // Move focus into the container when it becomes active (Requirement 13.3)
  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    // Small timeout lets the DOM settle (e.g. CSS transitions) before focusing
    const raf = requestAnimationFrame(() => {
      const focusable = getFocusableElements(container)
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        // Fallback: focus the container itself if it has no focusable children
        container.setAttribute('tabindex', '-1')
        container.focus()
      }
    })

    return () => cancelAnimationFrame(raf)
  }, [active, containerRef])

  // Return focus to the trigger when the trap deactivates (Requirement 13.4)
  useEffect(() => {
    if (active) return

    const trigger = triggerRef?.current
    if (trigger) {
      // Use rAF so the DOM has finished updating before we move focus back
      const raf = requestAnimationFrame(() => {
        trigger.focus()
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [active, triggerRef])

  // Intercept Tab / Shift+Tab to cycle within the container
  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(container)
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement

      if (event.shiftKey) {
        // Shift+Tab: if focus is on the first element, wrap to the last
        if (active === first || !container.contains(active)) {
          event.preventDefault()
          last.focus()
        }
      } else {
        // Tab: if focus is on the last element, wrap to the first
        if (active === last || !container.contains(active)) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [active, containerRef])
}
