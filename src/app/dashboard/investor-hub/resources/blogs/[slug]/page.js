"use client";
import { useParams, useRouter } from "next/navigation";
import { blogs } from "@/data/investorHub/resourcesData";
import useResourcesSavedState from "@/hooks/useResourcesSavedState";

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { savedBlogs, toggleSavedBlog } = useResourcesSavedState();
  const slug = params?.slug;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="text-lg font-semibold mb-2">Blog not found</div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white mt-2"
          onClick={() => router.push('/dashboard/investor-hub/resources')}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top nav */}
      <div className="pt-4 pb-2">
        <button
          className="mb-4 px-4 py-1 rounded bg-gray-100 text-gray-700 hover:bg-blue-50 text-sm font-medium"
          onClick={() => router.push('/dashboard/investor-hub/resources')}
          type="button"
        >
          ← Back to Resources
        </button>
      </div>
      {/* Hero */}
      <div className="mb-6">
        <img
          src={blog.bannerImage || 'https://placehold.co/400x200?text=Resource+Image'}
          alt={blog.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{blog.title}</h1>
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{blog.category}</span>
          <span className="text-xs text-gray-500">{blog.readTimeMinutes} min read</span>
          {blog.createdAt && (
            <span className="text-xs text-gray-400 ml-2">{blog.createdAt}</span>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className={`px-4 py-1 rounded text-sm font-medium transition ${savedBlogs.includes(blog.slug) ? 'bg-blue-50 border border-blue-600 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
            onClick={() => toggleSavedBlog(blog.slug)}
            type="button"
          >
            {savedBlogs.includes(blog.slug) ? 'Saved' : 'Save Blog'}
          </button>
          <button
            className="px-4 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700 cursor-not-allowed"
            type="button"
            disabled
          >
            Share
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="prose prose-blue max-w-3xl mb-8">
        {blog.contentSections?.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{section.heading}</h2>
            <p className="whitespace-pre-line text-gray-800">{section.body}</p>
          </div>
        ))}
      </div>
      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-xs text-yellow-800">
        Educational content only. Not investment advice. Consult a SEBI-registered advisor for personal guidance.
      </div>
    </div>
  );
}
