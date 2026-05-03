// Feature: accessibility-first-recipe-reader, Property 9: Voice guidance cancels before speaking

/**
 * Property 9: Voice guidance cancels before speaking
 *
 * For any sequence of speak(text) calls on the useVoice hook,
 * window.speechSynthesis.cancel() should be called before each new
 * window.speechSynthesis.speak() call, ensuring no overlapping narration.
 *
 * Validates: Requirements 12.6
 *
 * Note on fake timers: the useVoice hook defers window.speechSynthesis.speak()
 * by one tick (setTimeout 0) to work around a Chrome quirk where calling
 * speak() synchronously after cancel() silently drops the utterance. Tests
 * use jest.useFakeTimers() + jest.runAllTimers() to flush that timer
 * synchronously so assertions remain deterministic.
 */

import * as fc from 'fast-check'
import { renderHook, act } from '@testing-library/react'
import { useVoice } from '@/hooks/useVoice'

describe('Property 9: Voice guidance cancels before speaking', () => {
  let cancelMock: jest.Mock
  let speakMock: jest.Mock
  let callOrder: string[]

  beforeEach(() => {
    // Use fake timers so setTimeout(fn, 0) inside speak() can be flushed
    // synchronously with jest.runAllTimers().
    jest.useFakeTimers()

    // Reset call tracking before each test
    callOrder = []

    cancelMock = jest.fn(() => {
      callOrder.push('cancel')
    })

    speakMock = jest.fn(() => {
      callOrder.push('speak')
    })

    // Provide a minimal voice so the hook's voice-selection logic has
    // something to pick (avoids the voices.length === 0 branch).
    const fakeVoice = {
      name: 'Test Voice',
      lang: 'en-US',
      localService: true,
      default: true,
      voiceURI: 'test',
    } as SpeechSynthesisVoice

    // Override the global speechSynthesis mock with order-tracking spies
    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: {
        speak: speakMock,
        cancel: cancelMock,
        pause: jest.fn(),
        resume: jest.fn(),
        getVoices: jest.fn(() => [fakeVoice]),
        pending: false,
        speaking: false,
        paused: false,
        onvoiceschanged: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      },
    })
  })

  afterEach(() => {
    jest.runAllTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
    callOrder = []
  })

  it('calls cancel() before speak() for every call in a sequence of speak calls', () => {
    fc.assert(
      fc.property(
        // Generate sequences of at least 2 non-empty strings to speak
        fc.array(fc.string({ minLength: 1 }), { minLength: 2, maxLength: 20 }),
        (texts) => {
          // Reset tracking state for each property run
          callOrder = []
          cancelMock.mockClear()
          speakMock.mockClear()

          const { result } = renderHook(() => useVoice())

          // Invoke speak() for each text in the sequence, flushing the
          // deferred setTimeout after each call so speak() fires synchronously.
          texts.forEach((text) => {
            act(() => {
              result.current.speak(text)
              jest.runAllTimers()
            })
          })

          // There should be exactly one cancel() and one speak() call per text
          expect(cancelMock).toHaveBeenCalledTimes(texts.length)
          expect(speakMock).toHaveBeenCalledTimes(texts.length)

          // Verify the interleaved order: cancel must immediately precede each speak
          // Expected pattern: [cancel, speak, cancel, speak, ...]
          expect(callOrder).toHaveLength(texts.length * 2)

          for (let i = 0; i < texts.length; i++) {
            expect(callOrder[i * 2]).toBe('cancel')
            expect(callOrder[i * 2 + 1]).toBe('speak')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('cancel() is called before the very first speak() call', () => {
    const { result } = renderHook(() => useVoice())

    act(() => {
      result.current.speak('Hello, world!')
      jest.runAllTimers()
    })

    // Even on the first call, cancel must precede speak
    expect(callOrder[0]).toBe('cancel')
    expect(callOrder[1]).toBe('speak')
    expect(cancelMock).toHaveBeenCalledTimes(1)
    expect(speakMock).toHaveBeenCalledTimes(1)
  })

  it('cancel() is always the immediate predecessor of each speak() call', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 2, maxLength: 10 }),
        (texts) => {
          callOrder = []
          cancelMock.mockClear()
          speakMock.mockClear()

          const { result } = renderHook(() => useVoice())

          texts.forEach((text) => {
            act(() => {
              result.current.speak(text)
              jest.runAllTimers()
            })
          })

          // Find every index where 'speak' appears and assert 'cancel' is right before it
          callOrder.forEach((call, index) => {
            if (call === 'speak') {
              expect(index).toBeGreaterThan(0)
              expect(callOrder[index - 1]).toBe('cancel')
            }
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  it('speak() is never called without a preceding cancel() in the same invocation', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 15 }),
        (texts) => {
          callOrder = []
          cancelMock.mockClear()
          speakMock.mockClear()

          const { result } = renderHook(() => useVoice())

          texts.forEach((text) => {
            act(() => {
              result.current.speak(text)
              jest.runAllTimers()
            })
          })

          // The number of cancel calls must equal the number of speak calls
          // (one cancel per speak, no speak without a cancel)
          expect(cancelMock.mock.calls.length).toBe(speakMock.mock.calls.length)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('each speak() call passes the correct text to speechSynthesis.speak()', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
        (texts) => {
          callOrder = []
          cancelMock.mockClear()
          speakMock.mockClear()

          const { result } = renderHook(() => useVoice())

          texts.forEach((text) => {
            act(() => {
              result.current.speak(text)
              jest.runAllTimers()
            })
          })

          // Each speak() call should have received a SpeechSynthesisUtterance
          // whose text matches the input
          speakMock.mock.calls.forEach((callArgs, index) => {
            const utterance = callArgs[0] as SpeechSynthesisUtterance
            expect(utterance.text).toBe(texts[index])
          })
        }
      ),
      { numRuns: 100 }
    )
  })
})
