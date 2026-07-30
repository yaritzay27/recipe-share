import EmptyState from './EmptyState'
import RecipeCard from './RecipeCard'

function RecipeSkeletons() {
  return (
    <section className="masonry-grid" aria-label="Loading recipes">
      {Array.from({ length: 8 }, (_, index) => (
        <article
          className={`recipe-card skeleton-card recipe-card--${
            ['standard', 'tall', 'compact'][index % 3]
          }`}
          key={index}
        >
          <div className="skeleton skeleton--badge" />
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--title skeleton--title-short" />
          <div className="skeleton skeleton--meta" />
        </article>
      ))}
    </section>
  )
}

function RecipeFeed({ recipes, loading, error }) {
  if (loading) {
    return <RecipeSkeletons />
  }

  if (error) {
    return (
      <EmptyState
        title="Feed unavailable"
        message={error}
        actionLabel="Create Recipe"
        actionTo="/create"
      />
    )
  }

  if (!recipes.length) {
    return (
      <EmptyState
        title="No recipes found"
        message="Try another search or add a new recipe to the board."
      />
    )
  }

  return (
    <section className="masonry-grid" aria-label="Recipe feed">
      {recipes.map((recipe, index) => (
        <RecipeCard recipe={recipe} index={index} key={recipe.id} />
      ))}
    </section>
  )
}

export default RecipeFeed

