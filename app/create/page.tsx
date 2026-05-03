'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import { RecipeForm } from './_components/RecipeForm'

/**
 * Create Recipe page — auth-gated.
 * Redirects to /login if the user is not authenticated.
 *
 * Requirements: 7.1, 7.8, 7.9
 */
export default function CreateRecipePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()

  // Auth guard: redirect to /login when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  // Render nothing while redirecting
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create a Recipe</h1>
        <p className="mt-2 text-muted-foreground">
          Share your culinary creation with the community.
        </p>
      </header>

      <RecipeForm />
    </div>
  )
}
