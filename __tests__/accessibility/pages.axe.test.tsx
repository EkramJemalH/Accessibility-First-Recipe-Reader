// Feature: accessibility-first-recipe-reader, Axe accessibility tests for all page components
/**
 * Axe accessibility tests for all page components.
 *
 * Each test renders the page component (or its client component) with mock
 * context providers and asserts `expect(results).toHaveNoViolations()`.
 *
 * Requirements: 1.12, 13.1, 13.2
 */

import React from 'react'
import { render, act } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import type { Recipe } from '@/lib/recipes'
import type { AccessibilityContextValue } from '@/context/AccessibilityContext'
import type { AuthContextValue } from '@/context/AuthContext'
import type { RecipeContextValue } from '@/context/RecipeContext'
import type { FavoritesContextValue } from '@/context/FavoritesContext'

// Extend Jest matchers with jest-axe
expect.extend(toHaveNoViolations)

// ---------------------------------------------------------------------------
// Next.js navigation mocks
// ---------------------------------------------------------------------------

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ id: '1' }),
}))

// Mock next/link to render a plain <a> tag
jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock next/image to render a plain <img> tag
jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    fill,
    sizes,
    priority,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    sizes?: string
    priority?: boolean
    [key: string]: unknown
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

// ---------------------------------------------------------------------------
// next-themes mock
// ---------------------------------------------------------------------------

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ---------------------------------------------------------------------------
// Embla carousel / RecipeGrid mock
// (embla-carousel uses matchMedia which is not available in jsdom)
// ---------------------------------------------------------------------------

jest.mock('@/components/recipe-grid', () => {
  const React = require('react')
  const { RecipeCard } = require('@/components/RecipeCard')
  const MockRecipeGrid = ({
    recipes,
    title,
  }: {
    recipes: import('@/lib/recipes').Recipe[]
    title?: string
  }) => (
    <section>
      {title && <h2>{title}</h2>}
      <ul role="list" aria-label="Recipes">
        {recipes.map((recipe: import('@/lib/recipes').Recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
    </section>
  )
  MockRecipeGrid.displayName = 'MockRecipeGrid'
  return { RecipeGrid: MockRecipeGrid }
})

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockRecipe: Recipe = {
  id: '1',
  title: 'Fluffy Buttermilk Pancakes',
  description: 'Light and airy pancakes served with maple syrup, fresh berries, and a dusting of powdered sugar.',
  image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop',
  cookingTime: 20,
  servings: 4,
  difficulty: 'easy',
  category: 'breakfast',
  ingredients: [
    { name: 'All-purpose flour', amount: '300g' },
    { name: 'Buttermilk', amount: '400ml' },
    { name: 'Eggs', amount: '2' },
  ],
  instructions: [
    'Whisk flour, baking powder, sugar, and salt in a large bowl.',
    'In a separate bowl, mix buttermilk, eggs, melted butter, and vanilla.',
    'Pour wet ingredients into dry and stir until just combined.',
  ],
  tips: ['Do not overmix the batter.'],
}

const mockRecipe2: Recipe = {
  id: '2',
  title: 'Avocado & Poached Egg Toast',
  description: 'Creamy smashed avocado on sourdough topped with perfectly poached eggs.',
  image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&h=300&fit=crop',
  cookingTime: 15,
  servings: 2,
  difficulty: 'medium',
  category: 'breakfast',
  ingredients: [
    { name: 'Ripe avocados', amount: '2' },
    { name: 'Sourdough bread', amount: '4 slices' },
  ],
  instructions: [
    'Toast sourdough slices until golden and crispy.',
    'Mash avocados with lemon juice, salt, and pepper.',
  ],
}

// ---------------------------------------------------------------------------
// Mock context values
// ---------------------------------------------------------------------------

const mockAccessibilityContext: AccessibilityContextValue = {
  preferences: {
    fontSize: 'normal',
    lineSpacing: 'normal',
    highContrast: false,
    dyslexiaFriendly: false,
    reduceMotion: false,
    voiceEnabled: false,
  },
  updatePreference: jest.fn(),
  resetPreferences: jest.fn(),
  voiceEnabled: false,
  setVoiceEnabled: jest.fn(),
  isLoaded: true,
}

const mockAuthContextAuthenticated: AuthContextValue = {
  session: { username: 'testuser', email: 'test@example.com' },
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: true,
}

const mockAuthContextUnauthenticated: AuthContextValue = {
  session: null,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: false,
}

const mockRecipeContext: RecipeContextValue = {
  userRecipes: [],
  allRecipes: [mockRecipe, mockRecipe2],
  addRecipe: jest.fn(),
  deleteRecipe: jest.fn(),
}

const mockFavoritesContext: FavoritesContextValue = {
  savedIds: [],
  toggleSave: jest.fn(),
  isSaved: jest.fn().mockReturnValue(false),
}

// ---------------------------------------------------------------------------
// Context imports (for Provider wrapping)
// ---------------------------------------------------------------------------

// We mock the context modules so that the hooks return our mock values
jest.mock('@/context/AccessibilityContext', () => {
  const React = require('react')
  const AccessibilityContext = React.createContext(null)
  return {
    AccessibilityContext,
    AccessibilityProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(AccessibilityContext.Provider, { value: mockAccessibilityContext }, children),
    useAccessibilityContext: jest.fn(() => mockAccessibilityContext),
  }
})

jest.mock('@/context/AuthContext', () => {
  const React = require('react')
  const AuthContext = React.createContext(null)
  // Default: authenticated
  return {
    AuthContext,
    AuthProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthContext.Provider, { value: mockAuthContextAuthenticated }, children),
    useAuthContext: jest.fn(() => mockAuthContextAuthenticated),
  }
})

jest.mock('@/context/RecipeContext', () => {
  const React = require('react')
  const RecipeContext = React.createContext(null)
  return {
    RecipeContext,
    RecipeProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(RecipeContext.Provider, { value: mockRecipeContext }, children),
    useRecipeContext: jest.fn(() => mockRecipeContext),
  }
})

jest.mock('@/context/FavoritesContext', () => {
  const React = require('react')
  const FavoritesContext = React.createContext(null)
  return {
    FavoritesContext,
    FavoritesProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(FavoritesContext.Provider, { value: mockFavoritesContext }, children),
    useFavoritesContext: jest.fn(() => mockFavoritesContext),
  }
})

// ---------------------------------------------------------------------------
// MockProviders wrapper
// ---------------------------------------------------------------------------

function MockProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// ---------------------------------------------------------------------------
// Home page axe tests
// ---------------------------------------------------------------------------

describe('Home page — axe accessibility', () => {
  it('has no axe violations', async () => {
    const { HomePageClient } = await import('@/app/_components/HomePageClient')
    const { container } = render(
      <MockProviders>
        <HomePageClient />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Recipe Detail page axe tests
// ---------------------------------------------------------------------------

describe('Recipe Detail page — axe accessibility', () => {
  it('has no axe violations with a valid recipe', async () => {
    const { RecipeDetailClient } = await import(
      '@/app/recipe/[id]/_components/RecipeDetailClient'
    )
    const { container } = render(
      <MockProviders>
        <RecipeDetailClient recipeId="1" initialRecipe={mockRecipe} />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations when recipe is not found', async () => {
    const { RecipeDetailClient } = await import(
      '@/app/recipe/[id]/_components/RecipeDetailClient'
    )
    const { container } = render(
      <MockProviders>
        <RecipeDetailClient recipeId="nonexistent" initialRecipe={null} />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations when recipe is saved (aria-pressed=true)', async () => {
    const { useFavoritesContext } = await import('@/context/FavoritesContext')
    ;(useFavoritesContext as jest.Mock).mockReturnValueOnce({
      ...mockFavoritesContext,
      savedIds: ['1'],
      isSaved: jest.fn().mockReturnValue(true),
    })

    const { RecipeDetailClient } = await import(
      '@/app/recipe/[id]/_components/RecipeDetailClient'
    )
    const { container } = render(
      <MockProviders>
        <RecipeDetailClient recipeId="1" initialRecipe={mockRecipe} />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Cooking Mode page axe tests
// ---------------------------------------------------------------------------

describe('Cooking Mode page — axe accessibility', () => {
  it('has no axe violations on the first step', async () => {
    const CookingModePage = (await import('@/app/recipe/[id]/cooking/page')).default
    const { container } = render(
      <MockProviders>
        <CookingModePage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations when recipe is not found', async () => {
    const { useRecipeContext } = await import('@/context/RecipeContext')
    ;(useRecipeContext as jest.Mock).mockReturnValueOnce({
      ...mockRecipeContext,
      allRecipes: [],
    })

    const CookingModePage = (await import('@/app/recipe/[id]/cooking/page')).default
    const { container } = render(
      <MockProviders>
        <CookingModePage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Reading Mode page axe tests
// ---------------------------------------------------------------------------

describe('Reading Mode page — axe accessibility', () => {
  it('has no axe violations with a valid recipe', async () => {
    const ReadingModePage = (await import('@/app/recipe/[id]/reading/page')).default
    const { container } = render(
      <MockProviders>
        <ReadingModePage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations when recipe is not found', async () => {
    const { useRecipeContext } = await import('@/context/RecipeContext')
    ;(useRecipeContext as jest.Mock).mockReturnValueOnce({
      ...mockRecipeContext,
      allRecipes: [],
    })

    const ReadingModePage = (await import('@/app/recipe/[id]/reading/page')).default
    const { container } = render(
      <MockProviders>
        <ReadingModePage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Favorites page axe tests
// ---------------------------------------------------------------------------

describe('Favorites page — axe accessibility', () => {
  it('has no axe violations with no favorites (empty state)', async () => {
    const FavoritesPage = (await import('@/app/favorites/page')).default
    const { container } = render(
      <MockProviders>
        <FavoritesPage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations with saved recipes', async () => {
    const { useFavoritesContext } = await import('@/context/FavoritesContext')
    ;(useFavoritesContext as jest.Mock).mockReturnValueOnce({
      ...mockFavoritesContext,
      savedIds: ['1', '2'],
      isSaved: jest.fn().mockReturnValue(true),
    })

    const FavoritesPage = (await import('@/app/favorites/page')).default
    const { container } = render(
      <MockProviders>
        <FavoritesPage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Create Recipe page axe tests
// ---------------------------------------------------------------------------

describe('Create Recipe page — axe accessibility', () => {
  it('has no axe violations when authenticated', async () => {
    const CreateRecipePage = (await import('@/app/create/page')).default
    const { container } = render(
      <MockProviders>
        <CreateRecipePage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders nothing (redirect) when unauthenticated — no axe violations', async () => {
    const { useAuthContext } = await import('@/context/AuthContext')
    ;(useAuthContext as jest.Mock).mockReturnValueOnce(mockAuthContextUnauthenticated)

    const CreateRecipePage = (await import('@/app/create/page')).default
    const { container } = render(
      <MockProviders>
        <CreateRecipePage />
      </MockProviders>
    )
    // When unauthenticated, the page renders null (redirect in progress)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Profile page axe tests
// ---------------------------------------------------------------------------

describe('Profile page — axe accessibility', () => {
  it('has no axe violations when authenticated with no user recipes', async () => {
    const ProfilePage = (await import('@/app/profile/page')).default
    const { container } = render(
      <MockProviders>
        <ProfilePage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations when authenticated with user recipes', async () => {
    const { useRecipeContext } = await import('@/context/RecipeContext')
    ;(useRecipeContext as jest.Mock).mockReturnValueOnce({
      ...mockRecipeContext,
      userRecipes: [mockRecipe],
    })

    const ProfilePage = (await import('@/app/profile/page')).default
    const { container } = render(
      <MockProviders>
        <ProfilePage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders nothing (redirect) when unauthenticated — no axe violations', async () => {
    const { useAuthContext } = await import('@/context/AuthContext')
    ;(useAuthContext as jest.Mock).mockReturnValueOnce(mockAuthContextUnauthenticated)

    const ProfilePage = (await import('@/app/profile/page')).default
    const { container } = render(
      <MockProviders>
        <ProfilePage />
      </MockProviders>
    )
    // When unauthenticated, the page renders null (redirect in progress)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Settings page axe tests
// ---------------------------------------------------------------------------

describe('Settings page — axe accessibility', () => {
  it('has no axe violations with default preferences', async () => {
    const SettingsPage = (await import('@/app/settings/page')).default
    const { container } = render(
      <MockProviders>
        <SettingsPage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations with all accessibility features enabled', async () => {
    const { useAccessibilityContext } = await import('@/context/AccessibilityContext')
    ;(useAccessibilityContext as jest.Mock).mockReturnValueOnce({
      ...mockAccessibilityContext,
      preferences: {
        fontSize: 'large',
        lineSpacing: 'extra',
        highContrast: true,
        dyslexiaFriendly: true,
        reduceMotion: true,
        voiceEnabled: true,
      },
      voiceEnabled: true,
    })

    const SettingsPage = (await import('@/app/settings/page')).default
    const { container } = render(
      <MockProviders>
        <SettingsPage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Login page axe tests
// ---------------------------------------------------------------------------

describe('Login page — axe accessibility', () => {
  it('has no axe violations when unauthenticated (default state)', async () => {
    const { useAuthContext } = await import('@/context/AuthContext')
    ;(useAuthContext as jest.Mock).mockReturnValue(mockAuthContextUnauthenticated)

    const LoginPage = (await import('@/app/login/page')).default
    const { container } = render(
      <MockProviders>
        <LoginPage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders nothing (redirect) when already authenticated — no axe violations', async () => {
    const { useAuthContext } = await import('@/context/AuthContext')
    ;(useAuthContext as jest.Mock).mockReturnValue(mockAuthContextAuthenticated)

    const LoginPage = (await import('@/app/login/page')).default
    const { container } = render(
      <MockProviders>
        <LoginPage />
      </MockProviders>
    )
    // When authenticated, the page renders null (redirect in progress)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Signup page axe tests
// ---------------------------------------------------------------------------

describe('Signup page — axe accessibility', () => {
  it('has no axe violations when unauthenticated (default state)', async () => {
    const { useAuthContext } = await import('@/context/AuthContext')
    ;(useAuthContext as jest.Mock).mockReturnValue(mockAuthContextUnauthenticated)

    const SignupPage = (await import('@/app/signup/page')).default
    const { container } = render(
      <MockProviders>
        <SignupPage />
      </MockProviders>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders nothing (redirect) when already authenticated — no axe violations', async () => {
    const { useAuthContext } = await import('@/context/AuthContext')
    ;(useAuthContext as jest.Mock).mockReturnValue(mockAuthContextAuthenticated)

    const SignupPage = (await import('@/app/signup/page')).default
    const { container } = render(
      <MockProviders>
        <SignupPage />
      </MockProviders>
    )
    // When authenticated, the page renders null (redirect in progress)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
