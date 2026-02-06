import Link from 'next/link';
import SEO from '../../components/SEO';
import { blogs } from '../../data/blogs';

export async function getStaticPaths() {
    const paths = blogs.map(blog => ({
        params: { slug: blog.slug }
    }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const blog = blogs.find(b => b.slug === params.slug);
    return { props: { blog } };
}

export default function BlogPost({ blog }) {
    if (!blog) return null;

    return (
        <>
            <SEO
                title={`${blog.title} | OpenIPO Blog`}
                description={blog.excerpt}
                canonical={`https://openipo.in/blog/${blog.slug}`}
                openGraph={{ type: 'article' }}
            />

            <div className="page-container">
                <div className="breadcrumb">
                    <Link href="/blog">Blog</Link> &gt; <span>{blog.title}</span>
                </div>

                <article className="blog-content">
                    <header className="article-header">
                        <h1>{blog.title}</h1>
                    </header>

                    <div className="content-body" dangerouslySetInnerHTML={{ __html: blog.content }} />

                    <div className="share-box">
                        <p>Share this article if you found it helpful!</p>
                    </div>

                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Article",
                                "headline": blog.title,
                                "description": blog.excerpt,
                                "author": {
                                    "@type": "Organization",
                                    "name": "OpenIPO"
                                },
                                "publisher": {
                                    "@type": "Organization",
                                    "name": "OpenIPO",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://openipo.in/icons/logo.png"
                                    }
                                },
                                "mainEntityOfPage": {
                                    "@type": "WebPage",
                                    "@id": `https://openipo.in/blog/${blog.slug}`
                                },
                                "datePublished": new Date().toISOString()
                            })
                        }}
                    />
                </article>
            </div>

            <style jsx>{`
        .page-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 16px;
            background: #fff;
        }
        .breadcrumb {
            margin-bottom: 24px;
            color: #64748b;
        }
        .breadcrumb a {
            color: #2563eb;
            text-decoration: underline;
        }
        .article-header {
            margin-bottom: 30px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 20px;
        }
        h1 {
            font-size: 2.5rem;
            color: #0f172a;
            line-height: 1.2;
            margin: 0;
        }
        .content-body {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #334155;
        }
        /* CSS Deep Selector for inner HTML content if needed (styled-jsx handles scoping but v-html needs care) */
        .content-body :global(p) {
            margin-bottom: 20px;
        }
        .content-body :global(a) {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 600;
        }
        .content-body :global(strong) {
            color: #0f172a;
        }
        .share-box {
            margin-top: 50px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            text-align: center;
            color: #64748b;
        }
      `}</style>
        </>
    );
}
