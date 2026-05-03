'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Heart, LogOut, Settings, PlusCircle } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { useRecipeContext } from '@/context/RecipeContext'
import { RecipeCard } from '@/components/RecipeCard'

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Book illustration */}
      <div
        aria-hidden="true"
        className="flex h-24 w-24 items-center justify-center rounded-full bg-muted"
      >
        <BookOpen className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold text-foreground">No recipes yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          You haven&apos;t created any recipes. Start sharing your culinary creations!
        </p>
      </div>

      {/* Link to Create */}
      <Link
        href="/create"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Create your first recipe"
      >
        <PlusCircle className="h-4 w-4" aria-hidden="true" />
        Create a Recipe
      </Link>
    </div>
  )
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

/**
 * Profile page — auth-gated.
 * Redirects to /login if the user is not authenticated.
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
 */
export default function ProfilePage() {
  const router = useRouter()
  const { session, isAuthenticated, logout } = useAuthContext()
  const { userRecipes } = useRecipeContext()

  // Auth guard: redirect to /login when not authenticated (Requirement 8.5)
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  // Render nothing while redirecting
  if (!isAuthenticated || !session) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page heading — announced to screen readers via <h1> */}
      <h1 className="sr-only">My Profile</h1>

      {/* ── Profile header ─────────────────────────────────────────────────── */}
      <section aria-labelledby="profile-heading" className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* User info — Requirements 8.1 */}
          <div className="flex items-center gap-4">
            {/* Avatar placeholder */}
            <div
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
            >
              {session.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2
                id="profile-heading"
                className="text-2xl font-bold tracking-tight text-foreground"
              >
                {session.username}
              </h2>
              <p className="text-sm text-muted-foreground">{session.email}</p>
            </div>
          </div>

          {/* Log Out button — Requirement 8.6 */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out of your account"
            className="inline-flex items-center gap-2 self-start rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:self-auto"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log Out
          </button>
        </div>
      </section>

      {/* ── Shortcut links — Requirements 8.3, 8.4 ─────────────────────────── */}
      <nav aria-label="Profile shortcuts" className="mb-8">
        <ul role="list" className="flex flex-wrap gap-3">
          <li>
            <Link
              href="/favorites"
              aria-label="Go to your favorites"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Favorites
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              aria-label="Go to settings"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {/* ── My Recipes — Requirements 8.2, 8.7 ─────────────────────────────── */}
      <section aria-labelledby="my-recipes-heading">
        <h2
          id="my-recipes-heading"
          className="mb-6 text-xl font-semibold tracking-tight text-foreground"
        >
          My Recipes
          {userRecipes.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({userRecipes.length})
            </span>
          )}
        </h2>

        {userRecipes.length === 0 ? (
          /* Empty state with link to /create — Requirement 8.7 */
          <EmptyState />
        ) : (
          <>
            {/* Screen-reader announcement of count */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {`You have ${userRecipes.length} recipe${userRecipes.length === 1 ? '' : 's'}.`}
            </div>

            {/* Recipe grid — 1 col mobile, 2 col tablet, 3 col desktop */}
            <ul
              role="list"
              aria-label="Your created recipes"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {userRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <RecipeCard recipe={recipe} showFavoriteButton={true} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
