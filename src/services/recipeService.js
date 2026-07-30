import { isSupabaseConfigured, supabase } from './supabaseClient'

const recipeListColumns = 'id,title,cuisine,meal_type,created_at,upvotes'

const recipeDetailColumns = `
  id,
  title,
  description,
  ingredients,
  instructions,
  image_url,
  prep_time,
  cook_time,
  servings,
  difficulty,
  meal_type,
  cuisine,
  secret_key,
  created_at,
  upvotes
`

const configurationHint =
  'Supabase is not connected yet. Replace the placeholder URL and anon key in src/services/supabaseClient.js, then create the recipes and comments tables.'

function readableError(error) {
  if (!isSupabaseConfigured) {
    return configurationHint
  }

  return error?.message || 'Something went wrong while talking to Supabase.'
}

function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const numberValue = Number(value)
  return Number.isNaN(numberValue) ? null : numberValue
}

export function normalizeRecipePayload(recipe) {
  return {
    title: recipe.title.trim(),
    description: recipe.description?.trim() || null,
    ingredients: recipe.ingredients?.trim() || null,
    instructions: recipe.instructions?.trim() || null,
    image_url: recipe.image_url?.trim() || null,
    prep_time: toNumberOrNull(recipe.prep_time),
    cook_time: toNumberOrNull(recipe.cook_time),
    servings: toNumberOrNull(recipe.servings),
    difficulty: recipe.difficulty || null,
    meal_type: recipe.meal_type || null,
    cuisine: recipe.cuisine?.trim() || null,
    secret_key: recipe.secret_key.trim(),
  }
}

export async function fetchRecipes({
  searchTerm = '',
  sortBy = 'newest',
  cuisineFilter = 'all',
  mealTypeFilter = 'all',
} = {}) {
  let query = supabase.from('recipes').select(recipeListColumns)

  if (searchTerm.trim()) {
    query = query.ilike('title', `%${searchTerm.trim()}%`)
  }

  if (cuisineFilter !== 'all') {
    query = query.eq('cuisine', cuisineFilter)
  }

  if (mealTypeFilter !== 'all') {
    query = query.eq('meal_type', mealTypeFilter)
  }

  if (sortBy === 'oldest') {
    query = query.order('created_at', { ascending: true })
  } else if (sortBy === 'upvotes') {
    query = query
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    throw new Error(readableError(error))
  }

  return data || []
}

export async function fetchRecipeById(id) {
  const { data, error } = await supabase
    .from('recipes')
    .select(recipeDetailColumns)
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') {
    return null
  }

  if (error) {
    throw new Error(readableError(error))
  }

  return data
}

export async function createRecipe(recipe) {
  const payload = {
    ...normalizeRecipePayload(recipe),
    upvotes: 0,
  }

  const { data, error } = await supabase
    .from('recipes')
    .insert([payload])
    .select(recipeDetailColumns)
    .single()

  if (error) {
    throw new Error(readableError(error))
  }

  return data
}

export async function updateRecipe(id, recipe, secretKey) {
  const { data, error } = await supabase
    .from('recipes')
    .update(normalizeRecipePayload(recipe))
    .eq('id', id)
    .eq('secret_key', secretKey)
    .select(recipeDetailColumns)
    .single()

  if (error?.code === 'PGRST116') {
    throw new Error('The secret key did not match this recipe.')
  }

  if (error) {
    throw new Error(readableError(error))
  }

  return data
}

export async function deleteRecipe(id, secretKey) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('secret_key', secretKey)
    .select('id')
    .single()

  if (error?.code === 'PGRST116') {
    throw new Error('The secret key did not match this recipe.')
  }

  if (error) {
    throw new Error(readableError(error))
  }
}

export async function upvoteRecipe(id, currentUpvotes = 0) {
  const nextUpvotes = currentUpvotes + 1
  const { data, error } = await supabase
    .from('recipes')
    .update({ upvotes: nextUpvotes })
    .eq('id', id)
    .select(recipeDetailColumns)
    .single()

  if (error) {
    throw new Error(readableError(error))
  }

  return data
}

export async function fetchComments(recipeId) {
  const { data, error } = await supabase
    .from('comments')
    .select('id,recipe_id,comment,created_at')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(readableError(error))
  }

  return data || []
}

export async function createComment(recipeId, comment) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ recipe_id: recipeId, comment: comment.trim() }])
    .select('id,recipe_id,comment,created_at')
    .single()

  if (error) {
    throw new Error(readableError(error))
  }

  return data
}
