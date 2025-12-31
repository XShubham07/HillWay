'use client';
import { useState } from 'react';
import { FaSpinner, FaDownload, FaCopy, FaCheck, FaSitemap } from 'react-icons/fa';

export default function SitemapGenerator() {
    const [loading, setLoading] = useState(false);
    const [sitemapData, setSitemapData] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const generateSitemap = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/generate-sitemap');
            const data = await res.json();
            if (data.success) {
                setSitemapData(data.data);
            } else {
                setError(data.error || 'Failed to generate sitemap');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
        setLoading(false);
    };

    const downloadSitemap = () => {
        if (!sitemapData?.xml) return;
        const blob = new Blob([sitemapData.xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        URL.revokeObjectURL(url);
    };

    const copySitemap = async () => {
        if (!sitemapData?.xml) return;
        try {
            await navigator.clipboard.writeText(sitemapData.xml);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('Failed to copy. Please select and copy manually.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FaSitemap className="text-cyan-400" />
                    Sitemap Generator
                </h1>
                <button
                    onClick={generateSitemap}
                    disabled={loading}
                    className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 shadow-lg flex items-center gap-2 disabled:opacity-50 font-bold"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSitemap />}
                    {loading ? 'Generating...' : 'Generate Sitemap'}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400">
                    ❌ {error}
                </div>
            )}

            {sitemapData && (
                <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-cyan-400">{sitemapData.stats.tours}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Tours</p>
                        </div>
                        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-yellow-400">{sitemapData.stats.pages}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">SEO Pages</p>
                        </div>
                        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-purple-400">{sitemapData.stats.blogs}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Blogs</p>
                        </div>
                        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-gray-400">{sitemapData.stats.staticRoutes}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Static</p>
                        </div>
                        <div className="bg-[#1e293b] border border-cyan-500/50 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-white">{sitemapData.stats.totalUrls}</p>
                            <p className="text-xs text-cyan-400 uppercase tracking-wide">Total URLs</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={downloadSitemap}
                            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
                        >
                            <FaDownload /> Download sitemap.xml
                        </button>
                        <button
                            onClick={copySitemap}
                            className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition"
                        >
                            {copied ? <FaCheck /> : <FaCopy />}
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm text-gray-400 font-bold">XML Preview</p>
                            <p className="text-xs text-gray-500">Generated: {new Date(sitemapData.generatedAt).toLocaleString()}</p>
                        </div>
                        <pre className="text-xs text-gray-300 overflow-auto max-h-96 bg-black/50 p-4 rounded-lg border border-gray-800 font-mono whitespace-pre-wrap">
                            {sitemapData.xml}
                        </pre>
                    </div>

                    {/* Instructions */}
                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
                        <p className="text-cyan-400 font-bold mb-2">📋 Next Steps:</p>
                        <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                            <li>Download the <code className="text-cyan-400">sitemap.xml</code> file</li>
                            <li>Upload it to the root of your domain (<code className="text-cyan-400">public/sitemap.xml</code>)</li>
                            <li>Submit to Google Search Console</li>
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
}
