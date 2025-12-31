import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, pageId }) => {
  const [meta, setMeta] = useState({
    title: title || "",
    description: description || "",
    keywords: keywords || "",
  });

  useEffect(() => {
    // If pageId is present, fetch standard SEO data
    if (pageId) {
      const fetchSEO = async () => {
        try {
          const res = await fetch(`https://admin.hillway.in/api/page-seo?page=${pageId}`);
          const data = await res.json();

          if (data.success && data.data) {
            setMeta((prev) => ({
              ...prev,
              title: data.data.title || prev.title,
              description: data.data.description || prev.description,
              keywords: data.data.keywords || prev.keywords,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch SEO data:", error);
        }
      };

      fetchSEO();
    }
    // If no pageId but props changed, update state
    else {
      setMeta((prev) => ({
        ...prev,
        title: title || prev.title,
        description: description || prev.description,
        keywords: keywords || prev.keywords,
      }));
    }
  }, [pageId, title, description, keywords]);

  return (
    <Helmet>
      {/* Primary Meta Tags Only */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
    </Helmet>
  );
};

export default SEO;
