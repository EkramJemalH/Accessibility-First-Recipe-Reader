/**
 * Axe accessibility tests for Navbar, BottomNav, and RecipeCard components.
 *
 * Each test renders the component with React Testing Library, runs axe() from
 * jest-axe, and asserts no WCAG violations.
 *
 * Requirements: 1.7, 1.8, 13.1
 */

import React from 'react'
import { render, act } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import type { Recipe } from '@/lib/recipes'
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
}))

// Mock next/link to render a plain <a> tag (avoids router context issues)
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
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    sizes?: string
    [key: string]: unknown
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

// ---------------------------------------------------------------------------
// Context mocks
// ---------------------------------------------------------------------------

// Mock FavoritesContext so RecipeCard can call useFavoritesContext()
const mockFavoritesValue: FavoritesContextValue = {
  savedIds: [],
  toggleSave: jest.fn(),
  isSaved: jest.fn(() => false),
}

jest.mock('@/context/FavoritesContext', () => {
  const React = require('react')
  const FavoritesContext = React.createContext(null)

  return {
    FavoritesContext,
    FavoritesProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(FavoritesContext.Provider, { value: mockFavoritesValue }, children),
    useFavoritesContext: jest.fn(() => mockFavoritesValue),
  }
})

// ---------------------------------------------------------------------------
// Shared mock data
// ---------------------------------------------------------------------------

const mockRecipe: Recipe = {
  id: 'test-recipe-1',
  title: 'Test Pancakes',
  description: 'Fluffy test pancakes for accessibility testing.',
  image: 'https://example.com/pancakes.jpg',
  cookingTime: 20,
  servings: 4,
  difficulty: 'easy',
  category: 'breakfast',
  ingredients: [
    { name: 'Flour', amount: '300g' },
    { name: 'Eggs', amount: '2' },
  ],
  instructions: ['Mix ingredients.', 'Cook on griddle.'],
  tips: ['Do not overmix.'],
}

// ---------------------------------------------------------------------------
// Navbar axe tests
// ---------------------------------------------------------------------------

describe('Navbar — axe accessibility', () => {
  it('has no axe violations', async () => {
    const { Navbar } = await import('@/components/Navbar')
    const { container } = render(<Navbar />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations when mobile search overlay is open', async () => {
    const { Navbar } = await import('@/components/Navbar')
    const { container, getByRole } = render(<Navbar />)

    // Open the mobile search overlay
    await act(async () => {
      getByRole('button', { name: /open search/i }).click()
    })

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// BottomNav axe tests
// ---------------------------------------------------------------------------

describe('BottomNav — axe accessibility', () => {
  it('has no axe violations on the home path', async () => {
    const { BottomNav } = await import('@/components/BottomNav')
    const { container } = render(<BottomNav />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations on the favorites path', async () => {
    // Re-mock usePathname to simulate being on /favorites
    jest.resetModules()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
      }),
      usePathname: () => '/favorites',
      useSearchParams: () => new URLSearchParams(),
    }))

    const { BottomNav } = await import('@/components/BottomNav')
    const { container } = render(<BottomNav />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// RecipeCard axe tests
// ---------------------------------------------------------------------------

describe('RecipeCard — axe accessibility', () => {
  it('has no axe violations with default props (favorites button shown)', async () => {
    const { RecipeCard } = await import('@/components/RecipeCard')
    const { container } = render(<RecipeCard recipe={mockRecipe} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations when favorites button is hidden', async () => {
    const { RecipeCard } = await import('@/components/RecipeCard')
    const { container } = render(
      <RecipeCard recipe={mockRecipe} showFavoriteButton={false} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations when recipe is saved (aria-pressed=true)', async () => {
    // Override isSaved to return true for this test
    const { useFavoritesContext } = await import('@/context/FavoritesContext')
    ;(useFavoritesContext as jest.Mock).mockReturnValueOnce({
      savedIds: [mockRecipe.id],
      toggleSave: jest.fn(),
      isSaved: () => true,
    })

    const { RecipeCard } = await import('@/components/RecipeCard')
    const { container } = render(<RecipeCard recipe={mockRecipe} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations for a hard-difficulty recipe', async () => {
    const hardRecipe: Recipe = {
      ...mockRecipe,
      id: 'test-recipe-hard',
      title: 'Hard Recipe',
      difficulty: 'hard',
    }

    const { RecipeCard } = await import('@/components/RecipeCard')
    const { container } = render(<RecipeCard recipe={hardRecipe} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
