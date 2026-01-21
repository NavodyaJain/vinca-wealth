// src/hooks/useResourcesSavedState.js
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEYS = {
  blogs: 'savedBlogs',
  series: 'savedSeries',
  templates: 'savedTemplates',
};

function getInitialSaved(key) {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export default function useResourcesSavedState() {
  const [savedBlogs, setSavedBlogs] = useState(() => getInitialSaved(STORAGE_KEYS.blogs));
  const [savedSeries, setSavedSeries] = useState(() => getInitialSaved(STORAGE_KEYS.series));
  const [savedTemplates, setSavedTemplates] = useState(() => getInitialSaved(STORAGE_KEYS.templates));

  // Sync to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.blogs, JSON.stringify(savedBlogs));
  }, [savedBlogs]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.series, JSON.stringify(savedSeries));
  }, [savedSeries]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(savedTemplates));
  }, [savedTemplates]);

  // Toggle functions
  const toggleSavedBlog = useCallback((slug) => {
    setSavedBlogs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);
  const toggleSavedSeries = useCallback((id) => {
    setSavedSeries((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);
  const toggleSavedTemplate = useCallback((id) => {
    setSavedTemplates((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  return {
    savedBlogs,
    savedSeries,
    savedTemplates,
    toggleSavedBlog,
    toggleSavedSeries,
    toggleSavedTemplate,
  };
}
