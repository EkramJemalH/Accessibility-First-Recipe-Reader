// Feature: accessibility-first-recipe-reader, Property 12: Accessibility preferences application completeness

/**
 * Property 12: Accessibility preferences application completeness
 *
 * For any valid AccessibilityPreferences object, applying it via AccessibilityWrapper
 * should result in the <html> element having exactly the CSS custom properties and
 * class names that correspond to those preferences — no more, no less.
 *
 * Validates: Requirements 1.12, 9.4
 */

import * as fc from 'fast-check'
import { render, act } from '@testing-library/react'
import React from 'react'

// ─── Module-level mock for AccessibilityContext ───────────────────────────────
// Must be declared before any imports that use the module.

let mockPreferences = {
  fontSize: 'normal' as 'small' | 'normal' | 'large',
  lineSpacing: 'normal' as 'normal' | 'relaxed' | 'extra',
  highContrast: false,
  dyslexiaFriendly: false,
  reduceMotion: false,
  voiceEnabled: false,
}

jest.mock('@/context/AccessibilityContext', () => ({
  useAccessibilityContext: () => ({
    preferences: mockPreferences,
    updatePreference: jest.fn(),
    resetPreferences: jest.fn(),
    voiceEnabled: mockPreferences.voiceEnabled,
    setVoiceEnabled: jest.fn(),
    isLoaded: true,
  }),
}))

// Import after mock is set up
import { AccessibilityWrapper } from '@/components/accessibility-wrapper'

// ─── Preference mappings (mirrors AccessibilityWrapper implementation) ────────

const FONT_SCALE_MAP: Record<string, string> = {
  small: '0.9',
  normal: '1',
  large: '1.1',
}

const LINE_HEIGHT_MAP: Record<string, string> = {
  normal: '1.6',
  relaxed: '1.8',
  extra: '2',
}

// The three class names that AccessibilityWrapper manages on <html>
const MANAGED_CLASSES = ['high-contrast', 'dyslexia-friendly', 'reduce-motion'] as const

// ─── Arbitrary for AccessibilityPreferences ───────────────────────────────────

const preferencesArbitrary = fc.record({
  fontSize: fc.constantFrom('small', 'normal', 'large') as fc.Arbitrary<'small' | 'normal' | 'large'>,
  lineSpacing: fc.constantFrom('normal', 'relaxed', 'extra') as fc.Arbitrary<'normal' | 'relaxed' | 'extra'>,
  highContrast: fc.boolean(),
  dyslexiaFriendly: fc.boolean(),
  reduceMotion: fc.boolean(),
  voiceEnabled: fc.boolean(),
})

type Preferences = {
  fontSize: 'small' | 'normal' | 'large'
  lineSpacing: 'normal' | 'relaxed' | 'extra'
  highContrast: boolean
  dyslexiaFriendly: boolean
  reduceMotion: boolean
  voiceEnabled: boolean
}

// ─── Helper: derive expected state from preferences ───────────────────────────

function expectedState(prefs: Preferences) {
  return {
    fontScale: FONT_SCALE_MAP[prefs.fontSize] ?? '1',
    lineHeight: LINE_HEIGHT_MAP[prefs.lineSpacing] ?? '1.6',
    highContrast: prefs.highContrast,
    dyslexiaFriendly: prefs.dyslexiaFriendly,
    reduceMotion: prefs.reduceMotion,
  }
}

// ─── Helper: reset <html> element state ──────────────────────────────────────

function resetHtml() {
  const html = document.documentElement
  html.style.removeProperty('--font-scale')
  html.style.removeProperty('--line-height')
  MANAGED_CLASSES.forEach((cls) => html.classList.remove(cls))
}

// ─── Helper: render wrapper with given preferences ────────────────────────────

function renderWithPrefs(prefs: Preferences) {
  mockPreferences = prefs
  return render(
    <AccessibilityWrapper>
      <div data-testid="child" />
    </AccessibilityWrapper>
  )
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Property 12: Accessibility preferences application completeness', () => {
  beforeEach(() => {
    resetHtml()
  })

  afterEach(() => {
    resetHtml()
  })

  it('applies exactly the correct --font-scale CSS property for every fontSize value', () => {
    fc.assert(
      fc.property(preferencesArbitrary, (prefs) => {
        resetHtml()

        const { unmount } = renderWithPrefs(prefs)

        const expected = expectedState(prefs)
        const html = document.documentElement

        expect(html.style.getPropertyValue('--font-scale')).toBe(expected.fontScale)

        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('applies exactly the correct --line-height CSS property for every lineSpacing value', () => {
    fc.assert(
      fc.property(preferencesArbitrary, (prefs) => {
        resetHtml()

        const { unmount } = renderWithPrefs(prefs)

        const expected = expectedState(prefs)
        const html = document.documentElement

        expect(html.style.getPropertyValue('--line-height')).toBe(expected.lineHeight)

        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('applies exactly the correct class names for every boolean preference combination', () => {
    fc.assert(
      fc.property(preferencesArbitrary, (prefs) => {
        resetHtml()

        const { unmount } = renderWithPrefs(prefs)

        const expected = expectedState(prefs)
        const html = document.documentElement

        expect(html.classList.contains('high-contrast')).toBe(expected.highContrast)
        expect(html.classList.contains('dyslexia-friendly')).toBe(expected.dyslexiaFriendly)
        expect(html.classList.contains('reduce-motion')).toBe(expected.reduceMotion)

        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('applies no extra managed classes beyond the three controlled ones', () => {
    fc.assert(
      fc.property(preferencesArbitrary, (prefs) => {
        resetHtml()

        const { unmount } = renderWithPrefs(prefs)

        const html = document.documentElement
        const expected = expectedState(prefs)

        // Collect which managed classes are present after rendering
        const presentManagedClasses = MANAGED_CLASSES.filter((cls) =>
          html.classList.contains(cls)
        )

        // Build the expected set of present classes
        const expectedPresentClasses: string[] = []
        if (expected.highContrast) expectedPresentClasses.push('high-contrast')
        if (expected.dyslexiaFriendly) expectedPresentClasses.push('dyslexia-friendly')
        if (expected.reduceMotion) expectedPresentClasses.push('reduce-motion')

        // Exactly the right classes are present — no more, no less
        expect(presentManagedClasses.sort()).toEqual(expectedPresentClasses.sort())

        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('applies all preferences simultaneously and completely for any combination', () => {
    fc.assert(
      fc.property(preferencesArbitrary, (prefs) => {
        resetHtml()

        const { unmount } = renderWithPrefs(prefs)

        const expected = expectedState(prefs)
        const html = document.documentElement

        // All assertions together — no preference is missed, none is extra
        expect(html.style.getPropertyValue('--font-scale')).toBe(expected.fontScale)
        expect(html.style.getPropertyValue('--line-height')).toBe(expected.lineHeight)
        expect(html.classList.contains('high-contrast')).toBe(expected.highContrast)
        expect(html.classList.contains('dyslexia-friendly')).toBe(expected.dyslexiaFriendly)
        expect(html.classList.contains('reduce-motion')).toBe(expected.reduceMotion)

        unmount()
      }),
      { numRuns: 100 }
    )
  })

  it('removes a class when the corresponding preference is toggled off', () => {
    fc.assert(
      fc.property(
        fc.record({
          fontSize: fc.constantFrom('small', 'normal', 'large') as fc.Arbitrary<'small' | 'normal' | 'large'>,
          lineSpacing: fc.constantFrom('normal', 'relaxed', 'extra') as fc.Arbitrary<'normal' | 'relaxed' | 'extra'>,
          highContrast: fc.constant(true),
          dyslexiaFriendly: fc.boolean(),
          reduceMotion: fc.boolean(),
          voiceEnabled: fc.boolean(),
        }),
        (prefs) => {
          resetHtml()

          // First render with highContrast: true
          const { rerender, unmount } = renderWithPrefs(prefs)

          const html = document.documentElement
          expect(html.classList.contains('high-contrast')).toBe(true)

          // Update to highContrast: false
          const updatedPrefs = { ...prefs, highContrast: false }
          mockPreferences = updatedPrefs

          act(() => {
            rerender(
              <AccessibilityWrapper>
                <div data-testid="child" />
              </AccessibilityWrapper>
            )
          })

          expect(html.classList.contains('high-contrast')).toBe(false)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  it('updates --font-scale when fontSize preference changes', () => {
    fc.assert(
      fc.property(
        preferencesArbitrary,
        fc.constantFrom('small', 'normal', 'large') as fc.Arbitrary<'small' | 'normal' | 'large'>,
        (initialPrefs, newFontSize) => {
          resetHtml()

          const { rerender, unmount } = renderWithPrefs(initialPrefs)

          // Update fontSize
          const updatedPrefs = { ...initialPrefs, fontSize: newFontSize }
          mockPreferences = updatedPrefs

          act(() => {
            rerender(
              <AccessibilityWrapper>
                <div data-testid="child" />
              </AccessibilityWrapper>
            )
          })

          const html = document.documentElement
          const expectedFontScale = FONT_SCALE_MAP[newFontSize]
          expect(html.style.getPropertyValue('--font-scale')).toBe(expectedFontScale)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })
})
