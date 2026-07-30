function LoadingSpinner({ label = 'Loading' }) {
  return (
    <span className="loading-spinner" role="status" aria-label={label}>
      <span aria-hidden="true" />
    </span>
  )
}

export default LoadingSpinner

