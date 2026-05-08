// Feature: accessibility-first-recipe-reader, Property 10: Form validation rejects any submission with empty required fields

/**
 * Property 10: Form validation rejects any submission with empty required fields
 *
 * For any recipe form submission where at least one required field (title, description,
 * category, difficulty, cookingTime, servings) is empty or missing, the validation
 * function should return a non-empty errors object containing an entry for each empty
 * required field.
 *
 * Validates: Requirements 7.7
 */

import * as fc from 'fast-check'
import { validateRecipeForm, type RecipeFormData } from '@/lib/recipeValidation'

// Arbitrary for a non-empty, non-whitespace string (guaranteed to pass validation)
const nonEmptyStringArbitrary = fc
  .string({ minLength: 1 })
  .filter((s) => s.trim().length > 0)

// Arbitrary for a fully valid form (all required fields present and non-empty)
const validFormArbitrary = fc.record({
  title: nonEmptyStringArbitrary,
  description: nonEmptyStringArbitrary,
  category: fc.constantFrom('breakfast', 'lunch', 'dinner'),
  difficulty: fc.constantFrom('easy', 'medium', 'hard'),
  cookingTime: fc.integer({ min: 1, max: 300 }),
  servings: fc.integer({ min: 1, max: 20 }),
})

// The set of required field names
const REQUIRED_FIELDS = ['title', 'description', 'category', 'difficulty', 'cookingTime', 'servings'] as const
type RequiredField = typeof REQUIRED_FIELDS[number]

describe('Property 10: Form validation rejects any submission with empty required fields', () => {
  it('returns a non-empty errors object when at least one required field is missing (undefined)', () => {
    // Generate a form where at least one required field is set to undefined
    fc.assert(
      fc.property(
        fc.record({
          title: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          description: fc.option(fc.string(), { nil: undefined }),
          category: fc.option(fc.constantFrom('breakfast', 'lunch', 'dinner'), { nil: undefined }),
          difficulty: fc.option(fc.constantFrom('easy', 'medium', 'hard'), { nil: undefined }),
          cookingTime: fc.option(fc.integer({ min: 1 }), { nil: undefined }),
          servings: fc.option(fc.integer({ min: 1 }), { nil: undefined }),
        }),
        fc.subarray(REQUIRED_FIELDS as unknown as RequiredField[], { minLength: 1 }),
        (formData, fieldsToEmpty) => {
          // Force at least one field to be undefined
          const data: Partial<RecipeFormData> = { ...formData }
          for (const field of fieldsToEmpty) {
            data[field] = undefined
          }

          const errors = validateRecipeForm(data)

          // Must return a non-empty errors object
          expect(Object.keys(errors).length).toBeGreaterThan(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('returns an error entry for each empty required field', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          description: fc.option(fc.string(), { nil: undefined }),
          category: fc.option(fc.constantFrom('breakfast', 'lunch', 'dinner'), { nil: undefined }),
          difficulty: fc.option(fc.constantFrom('easy', 'medium', 'hard'), { nil: undefined }),
          cookingTime: fc.option(fc.integer({ min: 1 }), { nil: undefined }),
          servings: fc.option(fc.integer({ min: 1 }), { nil: undefined }),
        }),
        fc.subarray(REQUIRED_FIELDS as unknown as RequiredField[], { minLength: 1 }),
        (formData, fieldsToEmpty) => {
          const data: Partial<RecipeFormData> = { ...formData }
          for (const field of fieldsToEmpty) {
            data[field] = undefined
          }

          const errors = validateRecipeForm(data)

          // Each emptied field must have a corresponding error entry
          for (const field of fieldsToEmpty) {
            expect(errors).toHaveProperty(field)
            expect(errors[field as keyof typeof errors]).toBeTruthy()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('returns an empty errors object when all required fields are present and non-empty', () => {
    fc.assert(
      fc.property(validFormArbitrary, (formData) => {
        const errors = validateRecipeForm(formData)
        expect(Object.keys(errors)).toHaveLength(0)
      }),
      { numRuns: 100 }
    )
  })

  it('reports an error for title when it is an empty string', () => {
    fc.assert(
      fc.property(validFormArbitrary, (formData) => {
        const data: Partial<RecipeFormData> = { ...formData, title: '' }
        const errors = validateRecipeForm(data)
        expect(errors).toHaveProperty('title')
      }),
      { numRuns: 100 }
    )
  })

  it('reports an error for title when it is a whitespace-only string', () => {
    fc.assert(
      fc.property(
        validFormArbitrary,
        fc.string({ minLength: 1 }).map((s) => s.replace(/\S/g, ' ')),
        (formData, whitespace) => {
          // Ensure we have at least one space character
          const data: Partial<RecipeFormData> = { ...formData, title: whitespace || '   ' }
          const errors = validateRecipeForm(data)
          expect(errors).toHaveProperty('title')
        }
      ),
      { numRuns: 100 }
    )
  })

  it('reports an error for description when it is an empty string', () => {
    fc.assert(
      fc.property(validFormArbitrary, (formData) => {
        const data: Partial<RecipeFormData> = { ...formData, description: '' }
        const errors = validateRecipeForm(data)
        expect(errors).toHaveProperty('description')
      }),
      { numRuns: 100 }
    )
  })

  it('reports an error for cookingTime when it is null', () => {
    fc.assert(
      fc.property(validFormArbitrary, (formData) => {
        const data: Partial<RecipeFormData> = { ...formData, cookingTime: null }
        const errors = validateRecipeForm(data)
        expect(errors).toHaveProperty('cookingTime')
      }),
      { numRuns: 100 }
    )
  })

  it('reports an error for servings when it is null', () => {
    fc.assert(
      fc.property(validFormArbitrary, (formData) => {
        const data: Partial<RecipeFormData> = { ...formData, servings: null }
        const errors = validateRecipeForm(data)
        expect(errors).toHaveProperty('servings')
      }),
      { numRuns: 100 }
    )
  })

  it('does not report errors for fields that are correctly filled', () => {
    fc.assert(
      fc.property(
        validFormArbitrary,
        fc.subarray(REQUIRED_FIELDS as unknown as RequiredField[], { minLength: 1 }),
        (formData, fieldsToEmpty) => {
          const data: Partial<RecipeFormData> = { ...formData }
          for (const field of fieldsToEmpty) {
            data[field] = undefined
          }

          const errors = validateRecipeForm(data)
          const emptiedSet = new Set(fieldsToEmpty)

          // Fields that were NOT emptied should not have errors
          for (const field of REQUIRED_FIELDS) {
            if (!emptiedSet.has(field)) {
              expect(errors).not.toHaveProperty(field)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('handles a completely empty form object and reports all required field errors', () => {
    const errors = validateRecipeForm({})
    for (const field of REQUIRED_FIELDS) {
      expect(errors).toHaveProperty(field)
    }
    expect(Object.keys(errors)).toHaveLength(REQUIRED_FIELDS.length)
  })
})
