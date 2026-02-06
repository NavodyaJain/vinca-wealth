"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Share2, ChevronLeft, ChevronRight, Send } from "lucide-react";

const GRADIENT_PLACEHOLDER = (
  <div className="w-full h-56 bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 flex items-center justify-center rounded-t-2xl">
    <span className="text-5xl text-emerald-200">📝</span>
  </div>
);

export default function ReflectionDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [reflection, setReflection] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const all = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
      const found = all.find(r => r.id === id);
      setReflection(found || null);
      
      // Check if current user is owner (for now, assume owner if data exists locally)
      // In production, this would check against actual user auth
      setIsOwner(!!found);
      
      // Initialize likes from localStorage
      const storedLikes = JSON.parse(localStorage.getItem("reflection_likes") || "{}");
      setLikes(storedLikes);

      // Load comments for this post
      if (id) {
        const allComments = JSON.parse(localStorage.getItem('vinca_reflection_comments') || '{}');
        setComments(allComments[id] || []);
        
        const allCommentLikes = JSON.parse(localStorage.getItem('vinca_reflection_comment_likes') || '{}');
        setLikedComments(allCommentLikes[id] || {});
      }
    }
  }, [id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const all = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
    const filtered = all.filter(r => r.id !== id);
    localStorage.setItem("vinca_reflections", JSON.stringify(filtered));
    router.push("/dashboard/reflections");
  };

  const handleEditClick = () => {
    setEditData({
      title: reflection.title || '',
      journey: {
        context: reflection.journey?.context || { visibleFields: [] },
        challenges: reflection.journey?.challenges || [],
        howTheyHandled: reflection.journey?.howTheyHandled || '',
        reflection: reflection.journey?.reflection || ''
      }
    });
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    if (!editData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const all = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
    const updated = all.map(r => {
      if (r.id === id) {
        return {
          ...r,
          title: editData.title.trim(),
          journey: editData.journey
        };
      }
      return r;
    });
    
    localStorage.setItem("vinca_reflections", JSON.stringify(updated));
    setReflection(updated.find(r => r.id === id));
    setIsEditMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditData(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const all = JSON.parse(localStorage.getItem("vinca_reflections") || "[]");
      const found = all.find(r => r.id === id);
      setReflection(found || null);
      
      // Initialize likes from localStorage
      const storedLikes = JSON.parse(localStorage.getItem("reflection_likes") || "{}");
      setLikes(storedLikes);

      // Load comments for this post
      if (id) {
        const allComments = JSON.parse(localStorage.getItem('vinca_reflection_comments') || '{}');
        setComments(allComments[id] || []);
        
        const allCommentLikes = JSON.parse(localStorage.getItem('vinca_reflection_comment_likes') || '{}');
        setLikedComments(allCommentLikes[id] || {});
      }
    }
  }, [id]);

  const handleLike = () => {
    const newLikes = { ...likes, [id]: !likes[id] };
    setLikes(newLikes);
    localStorage.setItem("reflection_likes", JSON.stringify(newLikes));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Reflection",
        text: reflection.full.join(" "),
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Save comments to localStorage
  const saveComments = (updated) => {
    const allComments = JSON.parse(localStorage.getItem('vinca_reflection_comments') || '{}');
    allComments[id] = updated;
    localStorage.setItem('vinca_reflection_comments', JSON.stringify(allComments));
  };

  // Save likes to localStorage
  const saveCommentLikes = (updated) => {
    const allLikes = JSON.parse(localStorage.getItem('vinca_reflection_comment_likes') || '{}');
    allLikes[id] = updated;
    localStorage.setItem('vinca_reflection_comment_likes', JSON.stringify(allLikes));
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
    saveCommentLikes(updated);

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
    saveCommentLikes(updated);

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

  const photos = reflection?.photos && Array.isArray(reflection.photos) && reflection.photos.length > 0
    ? reflection.photos
    : (reflection?.photo ? [reflection.photo] : []);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (!reflection) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-lg text-slate-500 mb-4">Reflection not found.</div>
        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold" onClick={() => router.push('/dashboard/reflections')}>← Back to Footprints</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-md p-0 max-w-xl w-full flex flex-col overflow-hidden">
        {/* Photo Slider */}
        {photos.length > 0 ? (
          <div className="relative w-full h-56 bg-slate-200">
            <img
              src={photos[currentPhotoIndex]}
              alt={`Reflection photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Like and Share buttons on photo */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleLike}
                className="bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition"
              >
                <Heart
                  size={20}
                  className={likes[id] ? "fill-red-500 text-red-500" : "text-slate-600"}
                />
              </button>
              <button
                onClick={handleShare}
                className="bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition"
              >
                <Share2 size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Photo Slider Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition"
                >
                  <ChevronLeft size={20} className="text-slate-600" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>

                {/* Photo Counter */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        ) : (
          GRADIENT_PLACEHOLDER
        )}
        
        {/* Owner Controls - Edit/Delete */}
        {isOwner && (
          <div className="flex justify-end gap-2 px-8 pt-6 pb-2">
            {!isEditMode ? (
              <>
                <button
                  onClick={handleEditClick}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                  title="Edit post"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-slate-100 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                  title="Delete post"
                >
                  🗑 Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
                  title="Save changes"
                >
                  ✅ Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition text-sm"
                  title="Cancel editing"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="mx-8 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            ✅ Changes saved successfully
          </div>
        )}
        
        {/* Content - Structured Journal Format */}
        <div className="flex flex-col gap-8 p-8">
          {/* Title */}
          {isEditMode && editData ? (
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-2 block">Title</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg font-bold"
                placeholder="Enter title"
              />
            </div>
          ) : (
            reflection.title && (
              <h1 className="text-3xl font-bold text-slate-900">{reflection.title}</h1>
            )
          )}
          
          {/* SECTION 1: INTRODUCTION - Conditional based on visible fields */}
          {reflection.journey?.context?.visibleFields && reflection.journey.context.visibleFields.length > 0 && (
            <div className="border-b border-slate-200 pb-6">
              <div className="text-slate-800 text-base leading-relaxed space-y-2">
                {reflection.journey.context.visibleFields.includes('name') && (
                  <p>Hi, my name is {reflection.journey.context.name}.</p>
                )}
                {reflection.journey.context.visibleFields.includes('ageRange') && (
                  <p>I am {reflection.journey.context.ageRange}.</p>
                )}
                {reflection.journey.context.visibleFields.includes('retirementGoal') && (
                  <p>I want to retire by {reflection.journey.context.retirementGoal}.</p>
                )}
                {reflection.journey.context.visibleFields.includes('monthlySip') && (
                  <p>I currently invest around {reflection.journey.context.monthlySip} every month.</p>
                )}
              </div>
            </div>
          )}
          
          {/* SECTION 2: CHALLENGES */}
          {isEditMode && editData ? (
            <div>
              <label className="text-sm font-semibold text-slate-900 mb-3 block">Challenges I Faced</label>
              <div className="space-y-2">
                {editData.journey.challenges.map((challenge, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={challenge}
                      onChange={(e) => {
                        const updated = [...editData.journey.challenges];
                        updated[idx] = e.target.value;
                        setEditData({
                          ...editData,
                          journey: { ...editData.journey, challenges: updated }
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      placeholder="Challenge"
                    />
                    {editData.journey.challenges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editData.journey.challenges.filter((_, i) => i !== idx);
                          setEditData({
                            ...editData,
                            journey: { ...editData.journey, challenges: updated }
                          });
                        }}
                        className="text-red-600 hover:text-red-700 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setEditData({
                      ...editData,
                      journey: { ...editData.journey, challenges: [...editData.journey.challenges, ''] }
                    });
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-2"
                >
                  + Add challenge
                </button>
              </div>
            </div>
          ) : (
            reflection.journey?.challenges && reflection.journey.challenges.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Challenges I Faced</h2>
                <ul className="space-y-2 text-slate-800 text-base leading-relaxed">
                  {reflection.journey.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-slate-400">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
          
          {/* SECTION 3: HOW I WORKED THROUGH THEM */}
          {isEditMode && editData ? (
            <div>
              <label className="text-sm font-semibold text-slate-900 mb-2 block">How I Worked Through Them</label>
              <textarea
                value={editData.journey.howTheyHandled}
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    journey: { ...editData.journey, howTheyHandled: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none h-24"
                placeholder="How you dealt with these challenges..."
              />
            </div>
          ) : (
            reflection.journey?.howTheyHandled && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">How I Worked Through Them</h2>
                <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap">{reflection.journey.howTheyHandled}</p>
              </div>
            )
          )}
          
          {/* SECTION 4: LEARNINGS */}
          {isEditMode && editData ? (
            <div>
              <label className="text-sm font-semibold text-slate-900 mb-2 block">What This Journey Taught Me</label>
              <textarea
                value={editData.journey.reflection}
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    journey: { ...editData.journey, reflection: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none h-24"
                placeholder="What you learned from this journey..."
              />
            </div>
          ) : (
            reflection.journey?.reflection && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Journey Taught Me</h2>
                <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap">{reflection.journey.reflection}</p>
              </div>
            )
          )}
          
          {/* Fallback to legacy format if no journey data */}
          {!reflection.journey && reflection.full && (
            <>
              {reflection.full.map((para, idx) => (
                <p key={idx} className="text-slate-800 text-base leading-relaxed">{para}</p>
              ))}
            </>
          )}
        </div>

        {/* Remarks Section - Hidden in edit mode */}
        {!isEditMode && (
        <div className="mt-12 px-8 pb-8 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6 mt-8">Remarks</h3>
          
          {/* REMARKS INPUT CONTAINER - Always visible */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="comment-input-wrapper">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a thought or question…"
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

          {/* REMARKS LIST CONTAINER - Render only when remarks exist */}
          {comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment) => (
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
                            placeholder="Reply to this thought…"
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
              ))}
            </div>
          )}

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
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Delete Post?</h2>
            <p className="text-slate-600 mb-6">
              This action cannot be undone. Your post will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button className="mt-8 text-emerald-700 font-semibold" onClick={() => router.push('/dashboard/reflections')}>← Back to Footprints</button>
    </div>
  );
}

