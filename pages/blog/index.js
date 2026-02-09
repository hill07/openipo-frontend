import Link from 'next/link';
import SEO from '../../components/SEO';
import { blogs } from '../../data/blogs';

export default function BlogIndex() {
    return (
        <>
            <SEO
                title="OpenIPO Blog - IPO Education, News & Market Insights"
                description="Read the latest blogs on IPO market trends, educational guides, allotment tips, and investment strategies."
                canonical="https://openipo.in/blog"
            />

            <div className="page-container">
                <header className="page-header">
                    <h1>OpenIPO Blog</h1>
                    <p className="subtitle">Insights and Education for the Smart Investor</p>
                </header>

                <div className="blog-grid">
                    {blogs.map(blog => (
                        <article key={blog.slug} className="blog-card">
                            <Link href={`/blog/${blog.slug}`} className="card-link">
                                <h2>{blog.title}</h2>
                                <p>{blog.excerpt}</p>
                                <div className="read-more">Read Article →</div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .page-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 16px;
        }
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        h1 {
            font-size: 2.5rem;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #64748b;
        }
        .blog-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        .blog-card {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            transition: transform 0.2s, box-shadow 0.2s;
            overflow: hidden;
        }
        .blog-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
        .card-link {
            display: block;
            padding: 24px;
            text-decoration: none;
            color: inherit;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .blog-card h2 {
            font-size: 1.4rem;
            color: #1e293b;
            margin-top: 0;
            margin-bottom: 12px;
        }
        .blog-card p {
            color: #64748b;
            line-height: 1.6;
            flex-grow: 1;
        }
        .read-more {
            margin-top: 16px;
            font-weight: 600;
            color: #2563eb;
        }
      `}</style>
        </>
    );
}
