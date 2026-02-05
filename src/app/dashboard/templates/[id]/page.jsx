"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Send, Heart } from 'lucide-react';
import roleModelTemplates from '@/lib/templates/roleModelTemplates';

export default function RoleModelJourneyPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [template, setTemplate] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState({});

  // Load comments from localStorage on mount
  useEffect(() => {
    const found = roleModelTemplates.find(t => t.id === id);
    setTemplate(found);

    // Load comments for this post
    if (id) {
      const allComments = JSON.parse(localStorage.getItem('vinca_post_comments') || '{}');
      setComments(allComments[id] || []);
      
      const allLikes = JSON.parse(localStorage.getItem('vinca_comment_likes') || '{}');
      setLikedComments(allLikes[id] || {});
    }
  }, [id]);

  // Save comments to localStorage
  const saveComments = (updated) => {
    const allComments = JSON.parse(localStorage.getItem('vinca_post_comments') || '{}');
    allComments[id] = updated;
    localStorage.setItem('vinca_post_comments', JSON.stringify(allComments));
  };

  // Save likes to localStorage
  const saveLikes = (updated) => {
    const allLikes = JSON.parse(localStorage.getItem('vinca_comment_likes') || '{}');
    allLikes[id] = updated;
    localStorage.setItem('vinca_comment_likes', JSON.stringify(allLikes));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      text: commentText,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(updated);
    setCommentText('');
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;

    const updated = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...(comment.replies || []),
            {
              id: `reply_${Date.now()}`,
              text: replyText,
              createdAt: new Date().toISOString(),
              likes: 0
            }
          ]
        };
      }
      return comment;
    });

    setComments(updated);
    saveComments(updated);
    setReplyText('');
    setReplyingTo(null);
  };

  const handleLikeComment = (commentId) => {
    const updated = { ...likedComments };
    updated[commentId] = !updated[commentId];
    setLikedComments(updated);
    saveLikes(updated);

    // Update like count
    const commentUpdated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: updated[commentId] ? c.likes + 1 : Math.max(0, c.likes - 1)
        };
      }
      return c;
    });
    setComments(commentUpdated);
    saveComments(commentUpdated);
  };

  const handleLikeReply = (commentId, replyId) => {
    const likeKey = `${commentId}_${replyId}`;
    const updated = { ...likedComments };
    updated[likeKey] = !updated[likeKey];
    setLikedComments(updated);
    saveLikes(updated);

    // Update like count
    const commentUpdated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === replyId) {
              return {
                ...r,
                likes: updated[likeKey] ? r.likes + 1 : Math.max(0, r.likes - 1)
              };
            }
            return r;
          })
        };
      }
      return c;
    });
    setComments(commentUpdated);
    saveComments(commentUpdated);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!template) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-lg text-slate-500">Role model not found.</div>
        <button className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold" onClick={() => router.push('/dashboard/templates')}>← Back to Role Models</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <button className="mb-4 text-emerald-700 font-semibold" onClick={() => router.push('/dashboard/templates')}>← Back to Role Models</button>
      <div className="rounded-2xl bg-linear-to-r from-emerald-50 via-white to-emerald-50 p-6 mb-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <img src={template.thumbnailImage || '/images/templates/placeholder.jpg'} alt={template.name} className="w-32 h-32 object-cover rounded-2xl border border-gray-200" />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-slate-900">{template.name}'s Journey</h2>
          <div className="text-emerald-700 font-semibold text-lg">Goal: Retire by {template.goal.retireByAge} • Lifestyle: {template.goal.lifestyle}</div>
          <div className="text-slate-700 text-base">{template.heroLine}</div>
          <div className="flex gap-2 mt-2">
            <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{template.profession}</span>
            <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{template.family}</span>
            <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">{template.city}</span>
          </div>
        </div>
      </div>
      <div className="mb-8">
        {template.journeyTimeline.map((phase, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-200 shadow-sm mb-6 p-6 bg-white">
            <div className="font-bold text-lg text-emerald-700 mb-1">{phase.phaseTitle} <span className="text-xs text-slate-500 font-normal">{phase.duration}</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <div className="font-semibold text-slate-700 mb-1">What they did</div>
                <ul className="list-disc pl-5 text-slate-700 text-sm">
                  {phase.actions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-700 mb-1">Challenges faced</div>
                <ul className="list-disc pl-5 text-slate-700 text-sm">
                  {phase.challengesFaced.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-slate-700 mb-1">How they handled it</div>
                <ul className="list-disc pl-5 text-slate-700 text-sm">
                  {phase.howSolved.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Community Reflections</h3>
        
        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="comment-input-wrapper">
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment…"
              maxLength={500}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                  e.preventDefault();
                  handleAddComment(e);
                }
              }}
            />
            <button
              className="comment-send-btn"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              title="Send comment"
              aria-label="Send comment"
              type="button"
            >
              <Send size={18} />
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                {/* Comment */}
                <div className="comment-content">
                  <div className="comment-avatar">👤</div>
                  <div className="comment-body">
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-footer">
                      <span className="comment-time">{formatTime(comment.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    className={`comment-like-btn ${likedComments[comment.id] ? 'liked' : ''}`}
                    onClick={() => handleLikeComment(comment.id)}
                    title="Like comment"
                    type="button"
                  >
                    <Heart size={16} />
                    {comment.likes > 0 && <span className="like-count">{comment.likes}</span>}
                  </button>
                </div>

                {/* Reply Button */}
                <div className="comment-reply-section">
                  <button
                    className="reply-btn"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    type="button"
                  >
                    {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                  </button>
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddReply(comment.id);
                  }} className="reply-input-section">
                    <div className="reply-indent">
                      <div className="comment-input-wrapper">
                        <input
                          type="text"
                          className="comment-input"
                          placeholder="Reply to this comment…"
                          maxLength={500}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && replyText.trim()) {
                              e.preventDefault();
                              handleAddReply(comment.id);
                            }
                          }}
                          autoFocus
                        />
                        <button
                          className="comment-send-btn"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyText.trim()}
                          title="Send reply"
                          aria-label="Send reply"
                          type="button"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="replies-section">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="reply-card">
                        <div className="comment-avatar">👤</div>
                        <div className="comment-body">
                          <p className="comment-text">{reply.text}</p>
                          <div className="comment-footer">
                            <span className="comment-time">{formatTime(reply.createdAt)}</span>
                          </div>
                        </div>
                        <button
                          className={`comment-like-btn ${likedComments[`${comment.id}_${reply.id}`] ? 'liked' : ''}`}
                          onClick={() => handleLikeReply(comment.id, reply.id)}
                          title="Like reply"
                          type="button"
                        >
                          <Heart size={16} />
                          {reply.likes > 0 && <span className="like-count">{reply.likes}</span>}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .comment-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 12px 16px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .comment-input-wrapper:focus-within {
          border-color: #10b981;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
        }
        .comment-input {
          flex: 1;
          border: none;
          padding: 0;
          font-size: 0.95rem;
          background: transparent;
          font-family: inherit;
          color: #374151;
          outline: none;
        }
        .comment-input::placeholder {
          color: #9ca3af;
        }
        .comment-send-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #9ca3af;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .comment-send-btn:hover:not(:disabled) {
          color: #10b981;
        }
        .comment-send-btn:active:not(:disabled) {
          transform: scale(0.95);
        }
        .comment-send-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .comment-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          background: #fff;
          transition: all 0.2s ease;
        }
        .comment-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .comment-content {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .comment-body {
          flex: 1;
        }

        .comment-text {
          margin: 0;
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.5;
        }

        .comment-footer {
          display: flex;
          gap: 12px;
          margin-top: 6px;
        }

        .comment-time {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .comment-like-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.8rem;
        }
        .comment-like-btn:hover {
          background: #f3f4f6;
          color: #dc2626;
        }
        .comment-like-btn.liked {
          color: #dc2626;
        }

        .like-count {
          font-weight: 500;
        }

        .comment-reply-section {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          padding-left: 44px;
        }

        .reply-btn {
          font-size: 0.85rem;
          color: #10b981;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .reply-btn:hover {
          background: #d1fae5;
        }

        .reply-input-section {
          margin-top: 12px;
          margin-left: 44px;
        }

        .reply-indent {
          margin-left: 16px;
          padding: 12px;
          border-left: 2px solid #e5e7eb;
        }

        .replies-section {
          margin-top: 12px;
          margin-left: 44px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reply-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 2px solid #10b981;
        }

        .reply-card .comment-avatar {
          width: 28px;
          height: 28px;
          font-size: 14px;
        }

        .reply-card .comment-text {
          font-size: 0.9rem;
        }

        .reply-card .comment-time {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
