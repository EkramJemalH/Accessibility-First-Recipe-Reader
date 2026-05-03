'use client'

import { useEffect, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useRecipeContext } from '@/context/RecipeContext'
import type { Recipe } from '@/lib/recipes'

// Zod schema matching validateRecipeForm rules
const recipeFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['breakfast', 'lunch', 'dinner'], {
    errorMap: () => ({ message: 'Category is required' }),
  }),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Difficulty is required' }),
  }),
  cookingTime: z
    .number({ invalid_type_error: 'Cooking time is required' })
    .min(1, 'Cooking time must be at least 1 minute'),
  servings: z
    .number({ invalid_type_error: 'Servings is required' })
    .min(1, 'Servings must be at least 1'),
  ingredients: z
    .array(
      z.object({
        name: z.string(),
        amount: z.string(),
      })
    )
    .default([]),
  instructions: z.array(z.object({ value: z.string() })).default([]),
  image: z
    .string()
    .optional()
    .default('')
    .refine(
      (val) => val === '' || val.startsWith('http://') || val.startsWith('https://'),
      { message: 'Image URL must start with http:// or https://' }
    ),
})

type RecipeFormValues = z.infer<typeof recipeFormSchema>

interface RecipeFormProps {
  /**
   * When provided, the form operates in edit mode: fields are pre-filled
   * and submission calls updateRecipe instead of addRecipe.
   */
  initialRecipe?: Recipe
}

/**
 * Helper to merge a react-hook-form ref with a local ref callback.
 * react-hook-form's register() returns a ref callback; we need to call both.
 */
function mergeRefs<T>(
  rhfRef: (instance: T | null) => void,
  localRef: (instance: T | null) => void
) {
  return (instance: T | null) => {
    rhfRef(instance)
    localRef(instance)
  }
}

export function RecipeForm({ initialRecipe }: RecipeFormProps = {}) {
  const router = useRouter()
  const { addRecipe, updateRecipe } = useRecipeContext()
  const isEditMode = Boolean(initialRecipe)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: initialRecipe
      ? {
          title: initialRecipe.title,
          description: initialRecipe.description,
          category: initialRecipe.category,
          difficulty: initialRecipe.difficulty,
          cookingTime: initialRecipe.cookingTime,
          servings: initialRecipe.servings,
          ingredients: initialRecipe.ingredients,
          instructions: initialRecipe.instructions.map((v) => ({ value: v })),
          image: initialRecipe.image ?? '',
        }
      : {
          title: '',
          description: '',
          category: undefined,
          difficulty: undefined,
          cookingTime: undefined,
          servings: undefined,
          ingredients: [{ name: '', amount: '' }],
          instructions: [{ value: '' }],
          image: '',
        },
  })

  // Field arrays for dynamic ingredients and instructions
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' })

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control, name: 'instructions' })

  // Refs for focus management — track first input of each row
  const ingredientRefs = useRef<(HTMLInputElement | null)[]>([])
  const instructionRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  // Track previous lengths to detect newly added rows
  const prevIngredientLength = useRef(ingredientFields.length)
  const prevInstructionLength = useRef(instructionFields.length)

  // Focus first input of newly added ingredient row
  useEffect(() => {
    if (ingredientFields.length > prevIngredientLength.current) {
      const newIndex = ingredientFields.length - 1
      ingredientRefs.current[newIndex]?.focus()
    }
    prevIngredientLength.current = ingredientFields.length
  }, [ingredientFields.length])

  // Focus first input of newly added instruction row
  useEffect(() => {
    if (instructionFields.length > prevInstructionLength.current) {
      const newIndex = instructionFields.length - 1
      instructionRefs.current[newIndex]?.focus()
    }
    prevInstructionLength.current = instructionFields.length
  }, [instructionFields.length])

  const onSubmit = (data: RecipeFormValues) => {
    const recipeData = {
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      cookingTime: data.cookingTime,
      servings: data.servings,
      ingredients: data.ingredients,
      instructions: data.instructions.map((i) => i.value).filter(Boolean),
      image: data.image || '',
    }

    if (isEditMode && initialRecipe) {
      updateRecipe(initialRecipe.id, recipeData)
      router.push(`/recipe/${initialRecipe.id}`)
    } else {
      const newRecipe = addRecipe(recipeData)
      router.push(`/recipe/${newRecipe.id}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={isEditMode ? 'Edit recipe form' : 'Create recipe form'}
      className="space-y-6"
    >
      {/* Title */}
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="title"
          type="text"
          autoComplete="off"
          aria-required="true"
          aria-describedby={errors.title ? 'title-error' : undefined}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('title')}
        />
        {errors.title && (
          <p id="title-error" role="alert" className="text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Description <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="description"
          rows={3}
          aria-required="true"
          aria-describedby={errors.description ? 'description-error' : undefined}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('description')}
        />
        {errors.description && (
          <p id="description-error" role="alert" className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium">
          Category <span aria-hidden="true">*</span>
        </label>
        <select
          id="category"
          aria-required="true"
          aria-describedby={errors.category ? 'category-error' : undefined}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('category')}
        >
          <option value="">Select a category</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
        {errors.category && (
          <p id="category-error" role="alert" className="text-sm text-destructive">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Difficulty */}
      <div className="space-y-1">
        <label htmlFor="difficulty" className="block text-sm font-medium">
          Difficulty <span aria-hidden="true">*</span>
        </label>
        <select
          id="difficulty"
          aria-required="true"
          aria-describedby={errors.difficulty ? 'difficulty-error' : undefined}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('difficulty')}
        >
          <option value="">Select difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {errors.difficulty && (
          <p id="difficulty-error" role="alert" className="text-sm text-destructive">
            {errors.difficulty.message}
          </p>
        )}
      </div>

      {/* Cooking Time & Servings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="cookingTime" className="block text-sm font-medium">
            Cooking Time (minutes) <span aria-hidden="true">*</span>
          </label>
          <input
            id="cookingTime"
            type="number"
            min={1}
            aria-required="true"
            aria-describedby={errors.cookingTime ? 'cookingTime-error' : undefined}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            {...register('cookingTime', { valueAsNumber: true })}
          />
          {errors.cookingTime && (
            <p id="cookingTime-error" role="alert" className="text-sm text-destructive">
              {errors.cookingTime.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="servings" className="block text-sm font-medium">
            Servings <span aria-hidden="true">*</span>
          </label>
          <input
            id="servings"
            type="number"
            min={1}
            aria-required="true"
            aria-describedby={errors.servings ? 'servings-error' : undefined}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            {...register('servings', { valueAsNumber: true })}
          />
          {errors.servings && (
            <p id="servings-error" role="alert" className="text-sm text-destructive">
              {errors.servings.message}
            </p>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Ingredients</legend>
        <ul className="space-y-2" aria-label="Ingredients list">
          {ingredientFields.map((field, index) => {
            const { ref: rhfIngredientRef, ...ingredientNameProps } = register(
              `ingredients.${index}.name`
            )
            return (
              <li key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <label htmlFor={`ingredient-name-${index}`} className="sr-only">
                    Ingredient {index + 1} name
                  </label>
                  <input
                    id={`ingredient-name-${index}`}
                    type="text"
                    placeholder="Ingredient name"
                    aria-label={`Ingredient ${index + 1} name`}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    ref={mergeRefs(rhfIngredientRef, (el) => {
                      ingredientRefs.current[index] = el
                    })}
                    {...ingredientNameProps}
                  />
                </div>
                <div className="w-32 space-y-1">
                  <label htmlFor={`ingredient-amount-${index}`} className="sr-only">
                    Ingredient {index + 1} amount
                  </label>
                  <input
                    id={`ingredient-amount-${index}`}
                    type="text"
                    placeholder="Amount"
                    aria-label={`Ingredient ${index + 1} amount`}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register(`ingredients.${index}.amount`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  aria-label={`Remove ingredient ${index + 1}`}
                  className="mt-0.5 rounded-md p-2 text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() => appendIngredient({ name: '', amount: '' })}
          aria-label="Add ingredient"
          className="rounded-md border border-dashed border-input px-4 py-2 text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          + Add Ingredient
        </button>
      </fieldset>

      {/* Instructions */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Instructions</legend>
        <ol className="space-y-2" aria-label="Instructions list">
          {instructionFields.map((field, index) => {
            const { ref: rhfInstructionRef, ...instructionValueProps } = register(
              `instructions.${index}.value`
            )
            return (
              <li key={field.id} className="flex gap-2 items-start">
                <span
                  className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div className="flex-1 space-y-1">
                  <label htmlFor={`instruction-${index}`} className="sr-only">
                    Step {index + 1}
                  </label>
                  <textarea
                    id={`instruction-${index}`}
                    rows={2}
                    placeholder={`Step ${index + 1}`}
                    aria-label={`Step ${index + 1}`}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    ref={mergeRefs(rhfInstructionRef, (el) => {
                      instructionRefs.current[index] = el
                    })}
                    {...instructionValueProps}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  aria-label={`Remove step ${index + 1}`}
                  className="mt-0.5 rounded-md p-2 text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </li>
            )
          })}
        </ol>
        <button
          type="button"
          onClick={() => appendInstruction({ value: '' })}
          aria-label="Add step"
          className="rounded-md border border-dashed border-input px-4 py-2 text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          + Add Step
        </button>
      </fieldset>

      {/* Image URL (optional) */}
      <div className="space-y-1">
        <label htmlFor="image" className="block text-sm font-medium">
          Image URL <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          id="image"
          type="url"
          autoComplete="off"
          placeholder="https://example.com/photo.jpg"
          aria-describedby={errors.image ? 'image-error' : 'image-hint'}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('image')}
        />
        {errors.image ? (
          <p id="image-error" role="alert" className="text-sm text-destructive">
            {errors.image.message}
          </p>
        ) : (
          <p id="image-hint" className="text-xs text-muted-foreground">
            Paste a public image URL. Leave blank to use a placeholder.
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        >
          {isSubmitting
            ? isEditMode ? 'Saving…' : 'Creating…'
            : isEditMode ? 'Save Changes' : 'Create Recipe'}
        </button>
      </div>
    </form>
  )
}
