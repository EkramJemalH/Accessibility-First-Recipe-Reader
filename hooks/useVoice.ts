'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UseVoiceReturn {
  speak: (text: string) => void
  stop: () => void
  isSpeaking: boolean
  isSupported: boolean
}

/**
 * A hook that wraps the Web Speech API SpeechSynthesisUtterance interface.
 *
 * State machine:
 *   idle ──speak()──► speaking ──onend/stop()──► idle
 *                        │
 *                     speak()  (cancels current, starts new)
 *
 * - `speak(text)` cancels any ongoing speech before starting new speech,
 *   preventing overlapping narration (Requirement 12.6).
 *   A single-tick setTimeout defers the actual speak() call so Chrome's
 *   speech queue fully flushes after cancel() before the new utterance is
 *   pushed. Without this, Chrome silently drops the utterance when cancel()
 *   and speak() are called synchronously in the same call stack.
 * - `stop()` cancels any ongoing speech and resets isSpeaking to false.
 * - `isSupported` is detected client-side inside a useEffect to avoid SSR
 *   hydration mismatches. On the server it starts as false; after hydration
 *   it is set to true when the Web Speech API is available. This ensures
 *   speak() and stop() close over the correct reactive value (Requirement 12.5).
 * - Cleanup on unmount cancels any ongoing speech.
 */
export function useVoice(): UseVoiceReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Detect Web Speech API support client-side only, after hydration.
  // Using state (not a plain variable) ensures useCallback picks up the
  // correct value once the client has mounted.
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('speechSynthesis' in window)
  }, [])

  // Cancel any ongoing speech when the component using this hook unmounts.
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  /**
   * Speak the given text.
   * Cancels any current utterance first to prevent overlap (Requirement 12.6).
   * The actual speak() call is deferred by one tick so Chrome's queue fully
   * flushes after cancel() before the new utterance is pushed.
   *
   * Chrome quirks handled here:
   * 1. cancel() + speak() in the same tick silently drops the utterance →
   *    fixed by deferring speak() with setTimeout(fn, 0).
   * 2. Chrome on localhost can get stuck in a paused state → fixed by calling
   *    resume() before speak() inside the timeout.
   * 3. Chrome sometimes silently ignores utterances when no voice is explicitly
   *    set (picks a broken internal default). Explicitly assigning the first
   *    available voice forces Chrome to use a working voice engine.
   */
  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return

      // Cancel any ongoing speech before starting new speech.
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
      }

      // Chrome drops the utterance if speak() is called synchronously after
      // cancel(). A single-tick defer lets the queue flush first.
      setTimeout(() => {
        // Unstick Chrome's paused state (common on localhost).
        window.speechSynthesis.resume()

        // Explicitly set a voice so Chrome doesn't silently pick a broken
        // default. Prefer an English voice; fall back to the first available.
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          const englishVoice =
            voices.find((v) => v.lang.startsWith('en') && v.localService) ??
            voices.find((v) => v.lang.startsWith('en')) ??
            voices[0]
          utterance.voice = englishVoice
        }

        window.speechSynthesis.speak(utterance)
      }, 0)

      setIsSpeaking(true)
    },
    [isSupported]
  )

  /**
   * Stop any ongoing speech immediately.
   */
  const stop = useCallback(() => {
    if (!isSupported) return

    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  return { speak, stop, isSpeaking, isSupported }
}
