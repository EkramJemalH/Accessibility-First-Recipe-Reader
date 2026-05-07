'use client'

import { useTheme } from 'next-themes'
import { RotateCcw } from 'lucide-react'
import { useAccessibilityContext } from '@/context/AccessibilityContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// ─── SwitchToggle ─────────────────────────────────────────────────────────────

interface SwitchToggleProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/**
 * An accessible toggle switch using role="switch" and aria-checked.
 * Requirements: 9.7, 9.8
 */
function SwitchToggle({ id, label, description, checked, onChange }: SwitchToggleProps) {
  const descId = description ? `${id}-desc` : undefined

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-foreground"
        >
          {label}
        </label>
        {description && (
          <p id={descId} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-describedby={descId}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          checked ? 'bg-primary' : 'bg-input',
        ].join(' ')}
      >
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
        <span
          aria-hidden="true"
          className={[
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg',
            'transform transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </div>
  )
}

// ─── RadioGroup ───────────────────────────────────────────────────────────────

interface RadioOption<T extends string> {
  value: T
  label: string
}

interface RadioGroupProps<T extends string> {
  groupId: string
  legend: string
  description?: string
  options: RadioOption<T>[]
  value: T
  onChange: (value: T) => void
}

/**
 * An accessible radio group for selecting from a set of options.
 * Requirements: 9.1, 9.7
 */
function RadioGroup<T extends string>({
  groupId,
  legend,
  description,
  options,
  value,
  onChange,
}: RadioGroupProps<T>) {
  const descId = description ? `${groupId}-desc` : undefined

  return (
    <fieldset
      aria-describedby={descId}
      className="py-3"
    >
      <legend className="text-sm font-medium text-foreground">{legend}</legend>
      {description && (
        <p id={descId} className="mt-0.5 text-xs text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={legend}>
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={[
                'inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors',
                'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                value === option.value
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
              ].join(' ')}
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                aria-label={option.label}
                className="sr-only"
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

// ─── SettingsSection ──────────────────────────────────────────────────────────

interface SettingsSectionProps {
  id: string
  title: string
  children: React.ReactNode
}

function SettingsSection({ id, title, children }: SettingsSectionProps) {
  return (
    <section aria-labelledby={id} className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 id={id} className="mb-4 text-base font-semibold text-foreground">
        {title}
      </h2>
      <div className="divide-y divide-border">{children}</div>
    </section>
  )
}

// ─── SettingsPage ─────────────────────────────────────────────────────────────

/**
 * Settings page — accessibility and display preferences.
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8
 */
export default function SettingsPage() {
  const { preferences, updatePreference, resetPreferences } = useAccessibilityContext()
  const { theme, setTheme } = useTheme()

  const isDarkMode = theme === 'dark'

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Page heading */}
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
        Settings
      </h1>

      <div className="flex flex-col gap-6">

        {/* ── Display ──────────────────────────────────────────────────────── */}
        <SettingsSection id="display-heading" title="Display">

          {/* Dark / Light mode — Requirement 9.2 */}
          <SwitchToggle
            id="dark-mode-toggle"
            label="Dark mode"
            description="Switch between light and dark theme"
            checked={isDarkMode}
            onChange={handleThemeToggle}
          />

        </SettingsSection>

        {/* ── Text & Layout ─────────────────────────────────────────────────── */}
        <SettingsSection id="text-layout-heading" title="Text &amp; Layout">

          {/* Font size — Requirement 9.1 */}
          <RadioGroup
            groupId="font-size"
            legend="Font size"
            description="Adjust the base text size across the app"
            options={[
              { value: 'small', label: 'Small' },
              { value: 'normal', label: 'Normal' },
              { value: 'large', label: 'Large' },
            ]}
            value={preferences.fontSize}
            onChange={(v) => updatePreference('fontSize', v)}
          />

          {/* Line spacing — Requirement 9.1 */}
          <RadioGroup
            groupId="line-spacing"
            legend="Line spacing"
            description="Control the space between lines of text"
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'relaxed', label: 'Relaxed' },
              { value: 'extra', label: 'Extra' },
            ]}
            value={preferences.lineSpacing}
            onChange={(v) => updatePreference('lineSpacing', v)}
          />

        </SettingsSection>

        {/* ── Accessibility ─────────────────────────────────────────────────── */}
        <SettingsSection id="accessibility-heading" title="Accessibility">

          {/* High contrast — Requirement 9.1, 9.7, 9.8 */}
          <SwitchToggle
            id="high-contrast-toggle"
            label="High contrast"
            description="Increase color contrast for better visibility"
            checked={preferences.highContrast}
            onChange={(v) => updatePreference('highContrast', v)}
          />

          {/* Dyslexia-friendly — Requirement 9.1, 9.7, 9.8 */}
          <SwitchToggle
            id="dyslexia-friendly-toggle"
            label="Dyslexia-friendly font"
            description="Use a font designed to improve readability for dyslexia"
            checked={preferences.dyslexiaFriendly}
            onChange={(v) => updatePreference('dyslexiaFriendly', v)}
          />

          {/* Reduce motion — Requirement 9.1, 9.7, 9.8 */}
          <SwitchToggle
            id="reduce-motion-toggle"
            label="Reduce motion"
            description="Minimize animations and transitions"
            checked={preferences.reduceMotion}
            onChange={(v) => updatePreference('reduceMotion', v)}
          />

        </SettingsSection>

        {/* ── Voice Guidance ────────────────────────────────────────────────── */}
        <SettingsSection id="voice-heading" title="Voice Guidance">

          {/* Voice enabled — Requirement 9.3, 9.7, 9.8 */}
          <SwitchToggle
            id="voice-guidance-toggle"
            label="Voice guidance"
            description="Automatically narrate recipe steps using text-to-speech"
            checked={preferences.voiceEnabled}
            onChange={(v) => updatePreference('voiceEnabled', v)}
          />

        </SettingsSection>

        {/* ── Reset ─────────────────────────────────────────────────────────── */}
        <section aria-labelledby="reset-heading" className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 id="reset-heading" className="mb-2 text-base font-semibold text-foreground">
            Reset preferences
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Restore all accessibility and display settings to their default values.
          </p>

          {/* Confirmation dialog — Requirements 9.5, 9.6 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                aria-label="Reset all settings to defaults"
                className="inline-flex items-center gap-2 rounded-md border border-destructive/50 bg-background px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset to Defaults
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all settings?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will restore all accessibility and display preferences to their default
                  values. Your favorites and recipes will not be affected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel aria-label="Cancel reset">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={resetPreferences}
                  aria-label="Confirm reset all settings to defaults"
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

      </div>
    </div>
  )
}
