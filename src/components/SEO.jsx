import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, image, url, pageId }) => {
  const [meta, setMeta] = useState({
    title: title || "HillWay - Premium Tours & Travels",
    description: description || "Explore the best of Sikkim, Darjeeling, and more with HillWay.",
    keywords: keywords || "travel, tourism, sikkim, darjeeling, hillway, tours",
    image: image || "https://hillway.in/og-image.jpg",
    url: url || window.location.href,
  });

  useEffect(() => {
    // If pageId is present, fetch standard SEO data
    if (pageId) {
      const fetchSEO = async () => {
        try {
          // Using the specific API endpoint provided in instructions/codebase analysis
          const res = await fetch(`https://admin.hillway.in/api/page-seo?page=${pageId}`);
          const data = await res.json();

          if (data.success && data.data) {
            setMeta((prev) => ({
              ...prev,
              title: data.data.title || prev.title,
              description: data.data.description || prev.description,
              keywords: data.data.keywords || prev.keywords,
              // If backend provides image/url, use them, else fallback
              image: data.data.image || prev.image,
              url: data.data.url || prev.url
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
        image: image || prev.image,
        url: url || prev.url
      }));
    }
  }, [pageId, title, description, keywords, image, url]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{meta.title}</title>

      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={meta.url} />
      <meta property="twitter:title" content={meta.title} />
      <meta property="twitter:description" content={meta.description} />
      <meta property="twitter:image" content={meta.image} />
    </Helmet>
  );
};

export default SEO;
