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

const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters.')
      .max(30, 'Username must be at most 30 characters.'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

// ─── SignupPage ───────────────────────────────────────────────────────────────

/**
 * Signup page — redirects to / when already authenticated.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10
 */
export default function SignupPage() {
  const router = useRouter()
  const { isAuthenticated, signup } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Requirement 11.8: redirect to / when already authenticated
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
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  // Requirement 11.2: on valid submit, call signup() and redirect to /
  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data.username, data.email, data.password)
      router.push('/')
    } catch {
      // Surface unexpected auth errors as a form-level error
      setError('root', { message: 'Sign up failed. Please try again.' })
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
            Create an account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to create and save your own recipes.
          </p>
        </div>

        {/* Signup form — Requirements 11.1, 11.10 */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Sign up form"
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

          {/* Username field — Requirement 11.3 */}
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-foreground"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              aria-required="true"
              aria-describedby={errors.username ? 'username-error' : undefined}
              aria-invalid={errors.username ? 'true' : undefined}
              className={[
                'w-full rounded-md border bg-background px-3 py-2 text-sm',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                errors.username ? 'border-destructive' : 'border-input',
              ].join(' ')}
              placeholder="yourname"
              {...register('username')}
            />
            {/* Requirement 11.3: inline validation error with role="alert" */}
            {errors.username && (
              <p
                id="username-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email field — Requirement 11.4 */}
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
            {/* Requirement 11.4: inline validation error with role="alert" */}
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

          {/* Password field — Requirements 11.5, 11.9 */}
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
                autoComplete="new-password"
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
              {/* Requirement 11.9: show/hide toggle with dynamic aria-label */}
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
            {/* Requirement 11.5: inline validation error with role="alert" */}
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

          {/* Confirm Password field — Requirements 11.6, 11.9 */}
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                aria-required="true"
                aria-describedby={
                  errors.confirmPassword ? 'confirmPassword-error' : undefined
                }
                aria-invalid={errors.confirmPassword ? 'true' : undefined}
                className={[
                  'w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  errors.confirmPassword ? 'border-destructive' : 'border-input',
                ].join(' ')}
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {/* Requirement 11.9: show/hide toggle with dynamic aria-label */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
                aria-controls="confirmPassword"
                className={[
                  'absolute inset-y-0 right-0 flex items-center px-3',
                  'text-muted-foreground transition-colors hover:text-foreground',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                ].join(' ')}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {/* Requirement 11.6: inline validation error with role="alert" */}
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit button — disabled + spinner while loading */}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            aria-label={isSubmitting ? 'Signing up, please wait' : 'Sign up'}
            className={[
              'flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5',
              'bg-primary text-sm font-medium text-primary-foreground',
              'transition-colors hover:bg-primary/90',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isSubmitting ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>

        {/* Requirement 11.7: link to /login */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
