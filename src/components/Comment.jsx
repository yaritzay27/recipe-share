import { MessageCircle } from 'lucide-react'
import { formatRelativeTime } from '../utils/formatters'

function Comment({ comment }) {
  return (
    <article className="comment">
      <div className="comment__avatar" aria-hidden="true">
        <MessageCircle size={17} />
      </div>
      <div>
        <p>{comment.comment}</p>
        <time dateTime={comment.created_at}>
          {formatRelativeTime(comment.created_at)}
        </time>
      </div>
    </article>
  )
}

export default Comment

