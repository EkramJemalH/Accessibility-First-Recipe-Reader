'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'

// ─── Zod schema ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ─── LoginPage ────────────────────────────────────────────────────────────────

/**
 * Login page — redirects to / when already authenticated.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9
 */
export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)

  // Requirement 10.5: redirect to / when already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // Requirement 10.2: on valid submit, call login() and redirect to /
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password)
      router.push('/')
    } catch {
      // Surface unexpected auth errors as a form-level error
      setError('root', { message: 'Login failed. Please try again.' })
    }
  }

  // Don't render the form while redirecting an already-authenticated user
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your recipes and favorites.
          </p>
        </div>

        {/* Login form — Requirements 10.1, 10.8 */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Log in form"
          className="space-y-5"
        >
          {/* Root-level error (unexpected failures) */}
          {errors.root && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {errors.root.message}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-required="true"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email ? 'true' : undefined}
              className={[
                'w-full rounded-md border bg-background px-3 py-2 text-sm',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                errors.email ? 'border-destructive' : 'border-input',
              ].join(' ')}
              placeholder="you@example.com"
              {...register('email')}
            />
            {/* Requirement 10.3: inline validation error with role="alert" */}
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password field — Requirements 10.6, 10.7 */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                aria-required="true"
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={errors.password ? 'true' : undefined}
                className={[
                  'w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  errors.password ? 'border-destructive' : 'border-input',
                ].join(' ')}
                placeholder="••••••••"
                {...register('password')}
              />
              {/* Requirement 10.6, 10.7: show/hide toggle with dynamic aria-label */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-controls="password"
                className={[
                  'absolute inset-y-0 right-0 flex items-center px-3',
                  'text-muted-foreground transition-colors hover:text-foreground',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                ].join(' ')}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {/* Requirement 10.3: inline validation error with role="alert" */}
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button — Requirement 10.9: disabled + spinner while loading */}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            aria-label={isSubmitting ? 'Logging in, please wait' : 'Log in'}
            className={[
              'flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5',
              'bg-primary text-sm font-medium text-primary-foreground',
              'transition-colors hover:bg-primary/90',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
          >
            {isSubmitting && (
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {isSubmitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        {/* Requirement 10.4: link to /signup */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
