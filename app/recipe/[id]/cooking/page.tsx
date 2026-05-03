'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Timer,
  Play,
  Pause,
  RotateCw,
  CheckCircle2,
} from 'lucide-react'
import { useRecipeContext } from '@/context/RecipeContext'
import { useAccessibilityContext } from '@/context/AccessibilityContext'
import { useCookingStep } from '@/hooks/useCookingStep'
import { useVoice } from '@/hooks/useVoice'

// ─── Recipe Not Found ─────────────────────────────────────────────────────────

function RecipeNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-background">
      <span className="text-6xl" aria-hidden="true">
        🍽️
      </span>
      <h1 className="text-2xl font-bold text-foreground">Recipe not found</h1>
      <p className="max-w-sm text-muted-foreground">
        We couldn&apos;t find the recipe you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Back to Home
      </Link>
    </div>
  )
}

// ─── Completion Screen ────────────────────────────────────────────────────────

function CompletionScreen({ recipeId, recipeTitle }: { recipeId: string; recipeTitle: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center bg-background">
      <CheckCircle2
        className="h-20 w-20 text-green-500"
        aria-hidden="true"
      />
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">
          🎉 Congratulations!
        </h1>
        <p className="text-lg text-muted-foreground">
          You&apos;ve completed <span className="font-semibold text-foreground">{recipeTitle}</span>!
        </p>
        <p className="text-sm text-muted-foreground">
          Enjoy your meal!
        </p>
      </div>
      <Link
        href={`/recipe/${recipeId}`}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to Recipe
      </Link>
    </div>
  )
}

// ─── Cooking Mode Page ────────────────────────────────────────────────────────

/**
 * Cooking Mode page — step-by-step guided cooking with voice narration,
 * keyboard shortcuts, and a countdown timer.
 *
 * Requirements: 4.1–4.16
 */
export default function CookingModePage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const { allRecipes } = useRecipeContext()
  const { voiceEnabled, setVoiceEnabled } = useAccessibilityContext()
  const { speak, stop, isSpeaking, isSupported } = useVoice()

  const recipe = allRecipes.find((r) => r.id === recipeId) ?? null

  const totalSteps = recipe?.instructions.length ?? 0
  const { currentStep, next, prev, isFirst, isLast } = useCookingStep(totalSteps)

  // Completion state — becomes true when user presses Next on the last step
  const [completed, setCompleted] = useState(false)

  // ── Timer state ──────────────────────────────────────────────────────────
  const [timerMinutes, setTimerMinutes] = useState(5)
  const [timeLeft, setTimeLeft] = useState(0) // seconds
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerAlert, setTimerAlert] = useState(false)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Derived values ───────────────────────────────────────────────────────
  const currentInstruction = recipe?.instructions[currentStep] ?? ''

  // ── Voice guidance: speak on step change when voiceEnabled ───────────────
  // isSupported is false on the first render (SSR/hydration) and becomes true
  // after the client-side useEffect in useVoice runs. Including it in the deps
  // ensures this effect re-fires once the browser is ready, so the first step
  // is spoken correctly when the user arrives with voice already enabled.
  useEffect(() => {
    if (!isSupported) return

    if (!voiceEnabled) {
      stop()
      return
    }

    if (currentInstruction && !completed) {
      speak(currentInstruction)
    }
  }, [currentStep, currentInstruction, voiceEnabled, isSupported, completed, speak, stop])

  // ── Navigation handlers ──────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (isLast) {
      setCompleted(true)
      stop()
    } else {
      next()
    }
  }, [isLast, next, stop])

  const handlePrev = useCallback(() => {
    if (!isFirst) {
      prev()
    }
  }, [isFirst, prev])

  const handleRepeat = useCallback(() => {
    if (currentInstruction) {
      speak(currentInstruction)
    }
  }, [currentInstruction, speak])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when focus is on an input/textarea/select
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          handleNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlePrev()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          handleRepeat()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNext, handlePrev, handleRepeat])

  // ── Timer countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false)
            setTimerAlert(true)
            if (voiceEnabled && isSupported) {
              speak('Timer complete!')
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [timerRunning, timeLeft, voiceEnabled, isSupported, speak])

  const handleTimerStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(timerMinutes * 60)
    }
    setTimerAlert(false)
    setTimerRunning(true)
  }

  const handleTimerPause = () => {
    setTimerRunning(false)
  }

  const handleTimerReset = () => {
    setTimerRunning(false)
    setTimeLeft(0)
    setTimerAlert(false)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ── Early returns ────────────────────────────────────────────────────────
  if (!recipe) {
    return <RecipeNotFound />
  }

  if (completed) {
    return <CompletionScreen recipeId={recipeId} recipeTitle={recipe.title} />
  }

  const progressPercent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <div className="mx-auto max-w-2xl flex items-center justify-between gap-4">
          {/* Back link */}
          <Link
            href={`/recipe/${recipeId}`}
            aria-label={`Back to ${recipe.title}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>

          {/* Recipe title */}
          <h1 className="text-sm font-semibold text-foreground truncate flex-1 text-center">
            {recipe.title}
          </h1>

          {/* Voice toggle */}
          <button
            type="button"
            onClick={() => {
              if (voiceEnabled) {
                stop()
              }
              setVoiceEnabled(!voiceEnabled)
            }}
            aria-label={voiceEnabled ? 'Disable voice guidance' : 'Enable voice guidance'}
            aria-pressed={voiceEnabled}
            disabled={!isSupported}
            className={[
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              voiceEnabled
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border border-border bg-background text-foreground hover:bg-muted',
            ].join(' ')}
          >
            {voiceEnabled ? (
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {voiceEnabled ? 'Voice On' : 'Voice Off'}
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main id="main-content" className="flex-1 flex flex-col mx-auto w-full max-w-2xl px-4 py-6 gap-6">

        {/* ── Step header + progress bar ── */}
        <section aria-label="Step progress">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Progressbar */}
          <div
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
            className="h-2 w-full rounded-full bg-muted overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              aria-hidden="true"
            />
          </div>
        </section>

        {/* ── Current instruction ── */}
        <section
          aria-label="Current step instruction"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="rounded-xl bg-primary/10 border border-primary/20 px-6 py-8">
            <p className="text-lg leading-relaxed font-medium text-foreground">
              {currentInstruction}
            </p>
          </div>
        </section>

        {/* ── Navigation buttons ── */}
        <nav aria-label="Step navigation" className="flex items-center justify-center gap-3">
          {/* Previous */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            aria-label="Go to previous step"
            className={[
              'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'border border-border',
              isFirst
                ? 'opacity-50 cursor-not-allowed bg-background text-muted-foreground'
                : 'bg-background text-foreground hover:bg-muted',
            ].join(' ')}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={handleRepeat}
            aria-label="Repeat current step instruction"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Repeat
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={handleNext}
            aria-label={isLast ? 'Complete recipe' : 'Go to next step'}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isLast ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>

        {/* ── Keyboard shortcuts hint ── */}
        <p className="text-center text-xs text-muted-foreground" aria-hidden="true">
          Keyboard: <kbd className="rounded border px-1 py-0.5 font-mono text-xs">←</kbd> Prev &nbsp;
          <kbd className="rounded border px-1 py-0.5 font-mono text-xs">→</kbd> / <kbd className="rounded border px-1 py-0.5 font-mono text-xs">Space</kbd> Next &nbsp;
          <kbd className="rounded border px-1 py-0.5 font-mono text-xs">R</kbd> Repeat
        </p>

        {/* ── Countdown timer ── */}
        <section aria-labelledby="timer-heading" className="rounded-xl border border-border bg-muted/30 px-5 py-5">
          <h2
            id="timer-heading"
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <Timer className="h-4 w-4" aria-hidden="true" />
            Countdown Timer
          </h2>

          {/* Timer alert */}
          {timerAlert && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 rounded-md bg-green-100 border border-green-300 px-4 py-3 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
            >
              ✅ Timer complete!
            </div>
          )}

          <div className="flex flex-wrap items-end gap-4">
            {/* Minutes input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="timer-minutes" className="text-xs text-muted-foreground">
                Minutes
              </label>
              <input
                id="timer-minutes"
                type="number"
                min={1}
                max={120}
                value={timerMinutes}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(120, parseInt(e.target.value, 10) || 1))
                  setTimerMinutes(val)
                  if (!timerRunning) {
                    setTimeLeft(0) // reset display when input changes
                  }
                }}
                disabled={timerRunning}
                aria-label="Timer duration in minutes"
                className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              />
            </div>

            {/* Time display */}
            <div
              aria-live="polite"
              aria-label={`Time remaining: ${timeLeft > 0 ? formatTime(timeLeft) : `${timerMinutes}:00`}`}
              className="text-2xl font-mono font-bold text-foreground tabular-nums min-w-[5rem] text-center"
            >
              {timeLeft > 0 ? formatTime(timeLeft) : `${timerMinutes}:00`}
            </div>

            {/* Timer controls */}
            <div className="flex items-center gap-2">
              {!timerRunning ? (
                <button
                  type="button"
                  onClick={handleTimerStart}
                  aria-label="Start timer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  Start
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleTimerPause}
                  aria-label="Pause timer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  Pause
                </button>
              )}

              <button
                type="button"
                onClick={handleTimerReset}
                aria-label="Reset timer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
