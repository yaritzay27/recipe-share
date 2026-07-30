import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createComment, fetchComments } from '../services/recipeService'
import Comment from './Comment'
import LoadingSpinner from './LoadingSpinner'

function CommentSection({ recipeId }) {
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadComments() {
      setLoading(true)
      setError('')

      try {
        const commentData = await fetchComments(recipeId)
        if (isMounted) {
          setComments(commentData)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadComments()

    return () => {
      isMounted = false
    }
  }, [recipeId])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!commentText.trim()) {
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const newComment = await createComment(recipeId, commentText)
      setComments((currentComments) => [...currentComments, newComment])
      setCommentText('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="comments-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Discussion</p>
          <h2>Comments</h2>
        </div>
        <span className="comment-count">
          <MessageCircle size={17} aria-hidden="true" />
          {comments.length}
        </span>
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <label htmlFor="comment">Leave a comment</label>
        <div className="comment-form__row">
          <textarea
            id="comment"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Share a tweak, question, or serving idea"
            rows="3"
          />
          <button
            type="submit"
            className="button button--primary button--icon-only"
            aria-label="Post comment"
            disabled={submitting || !commentText.trim()}
          >
            {submitting ? (
              <LoadingSpinner label="Posting comment" />
            ) : (
              <Send size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </form>

      {error ? <p className="form-error">{error}</p> : null}

      {loading ? (
        <div className="comment-list" aria-label="Loading comments">
          <div className="comment skeleton-comment" />
          <div className="comment skeleton-comment" />
        </div>
      ) : comments.length ? (
        <div className="comment-list">
          {comments.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </div>
      ) : (
        <p className="comments-empty">No comments yet.</p>
      )}
    </section>
  )
}

export default CommentSection
