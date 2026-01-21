
"use client";
import { useState, useMemo } from "react";
import { videoSeries, blogs, templates } from "@/data/investorHub/resourcesData";
import useResourcesSavedState from "@/hooks/useResourcesSavedState";
import ResourcesTabs from "@/components/investorHub/resources/ResourcesTabs";
import VideoSeriesCard from "@/components/investorHub/resources/VideoSeriesCard";
import BlogCard from "@/components/investorHub/resources/BlogCard";
import TemplateCard from "@/components/investorHub/resources/TemplateCard";

const TABS = ["all", "video-series", "blogs", "templates", "saved"];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const {
    savedBlogs,
    savedSeries,
    savedTemplates,
    toggleSavedBlog,
    toggleSavedSeries,
    toggleSavedTemplate,
  } = useResourcesSavedState();

  // Memoized filtered data for Saved tab
  const savedVideoSeries = useMemo(() => videoSeries.filter(s => savedSeries.includes(s.id)), [savedSeries]);
  const savedBlogsList = useMemo(() => blogs.filter(b => savedBlogs.includes(b.slug)), [savedBlogs]);
  const savedTemplatesList = useMemo(() => templates.filter(t => savedTemplates.includes(t.id)), [savedTemplates]);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 pb-12">
      <div className="pt-6 pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Investor Hub Resources</h1>
        <p className="text-gray-600 mb-2">Learn retirement planning frameworks, watch structured series, and use goal templates.</p>
        <span className="block text-xs text-gray-400 mb-2">Educational content for awareness only. Not investment advice. Please consult a SEBI-registered advisor for personalized decisions.</span>
      </div>
      <ResourcesTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "all" && (
        <>
          {/* Featured Video Series */}
          <SectionTitle>Featured Video Series</SectionTitle>
          <div className="flex gap-4 overflow-x-auto pb-2 mb-6 hide-scrollbar">
            {videoSeries.slice(0, 3).map((series) => (
              <div key={series.id} className="shrink-0">
                <VideoSeriesCard
                  series={series}
                  isSaved={savedSeries.includes(series.id)}
                  onSave={() => toggleSavedSeries(series.id)}
                  onExplore={() => window.location.assign(`/dashboard/investor-hub/resources/video-series/${series.id}`)}
                />
              </div>
            ))}
          </div>

          {/* Latest Blog Articles */}
          <SectionTitle>Latest Blog Articles</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard
                key={blog.slug}
                blog={blog}
                isSaved={savedBlogs.includes(blog.slug)}
                onSave={() => toggleSavedBlog(blog.slug)}
                onView={() => {}}
              />
            ))}
          </div>

          {/* Popular Goal Templates */}
          <SectionTitle>Popular Goal Templates</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {templates.slice(0, 3).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSaved={savedTemplates.includes(template.id)}
                onSave={() => toggleSavedTemplate(template.id)}
                onView={() => {}}
                onDownload={() => {}}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === "video-series" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videoSeries.map((series) => (
            <VideoSeriesCard
              key={series.id}
              series={series}
              isSaved={savedSeries.includes(series.id)}
              onSave={() => toggleSavedSeries(series.id)}
              onExplore={() => window.location.assign(`/dashboard/investor-hub/resources/video-series/${series.id}`)}
            />
          ))}
        </div>
      )}

      {activeTab === "blogs" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.slug}
              blog={blog}
              isSaved={savedBlogs.includes(blog.slug)}
              onSave={() => toggleSavedBlog(blog.slug)}
              onView={() => {}}
            />
          ))}
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSaved={savedTemplates.includes(template.id)}
              onSave={() => toggleSavedTemplate(template.id)}
              onView={() => {}}
              onDownload={() => {}}
            />
          ))}
        </div>
      )}

      {activeTab === "saved" && (
        <div>
          {savedVideoSeries.length === 0 && savedBlogsList.length === 0 && savedTemplatesList.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No saved resources yet.</div>
          ) : (
            <>
              {savedVideoSeries.length > 0 && (
                <>
                  <SectionTitle>Saved Video Series</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {savedVideoSeries.map((series) => (
                      <VideoSeriesCard
                        key={series.id}
                        series={series}
                        isSaved={true}
                        onSave={() => toggleSavedSeries(series.id)}
                        onExplore={() => window.location.assign(`/dashboard/investor-hub/resources/video-series/${series.id}`)}
                      />
                    ))}
                  </div>
                </>
              )}
              {savedBlogsList.length > 0 && (
                <>
                  <SectionTitle>Saved Blogs</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {savedBlogsList.map((blog) => (
                      <BlogCard
                        key={blog.slug}
                        blog={blog}
                        isSaved={true}
                        onSave={() => toggleSavedBlog(blog.slug)}
                        onView={() => {}}
                      />
                    ))}
                  </div>
                </>
              )}
              {savedTemplatesList.length > 0 && (
                <>
                  <SectionTitle>Saved Templates</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {savedTemplatesList.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSaved={true}
                        onSave={() => toggleSavedTemplate(template.id)}
                        onView={() => {}}
                        onDownload={() => {}}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-lg font-semibold mb-2 mt-6">{children}</h2>;
}
