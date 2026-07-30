const relativeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
})

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatRelativeTime(dateValue) {
  if (!dateValue) {
    return 'Just now'
  }

  const timestamp = new Date(dateValue).getTime()
  if (Number.isNaN(timestamp)) {
    return 'Just now'
  }

  const diffSeconds = Math.round((timestamp - Date.now()) / 1000)
  if (Math.abs(diffSeconds) < 45) {
    return 'Just now'
  }

  const units = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ]

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diffSeconds) >= secondsInUnit || unit === 'minute') {
      return relativeFormatter.format(Math.round(diffSeconds / secondsInUnit), unit)
    }
  }

  return 'Just now'
}

export function formatDate(dateValue) {
  if (!dateValue) {
    return 'Date unavailable'
  }

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return dateFormatter.format(date)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en').format(value || 0)
}

export function splitLines(value) {
  return (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function totalCookTime(recipe) {
  return (recipe?.prep_time || 0) + (recipe?.cook_time || 0)
}
