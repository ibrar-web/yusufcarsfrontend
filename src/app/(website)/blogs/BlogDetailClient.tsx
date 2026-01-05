"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost, BlogSummary } from "@/data/blog-posts";

const comments = [
  {
    author: "Jamie Rivera",
    body: "Great breakdown—curious if the titanium exhaust helps reduce cabin drone at motorway speeds?",
    time: "2 hours ago",
  },
  {
    author: "Leo Kingston",
    body: "Would love to see more data on oil temps when pushing for longer than 20 minutes.",
    time: "Yesterday",
  },
];

type BlogDetailClientProps = {
  post: BlogPost;
  trendingArticles: BlogSummary[];
};

export function BlogDetailClient({
  post,
  trendingArticles,
}: BlogDetailClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState(8);

  const filteredTrending = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return trendingArticles;
    }
    return trendingArticles.filter((article) =>
      article.title.toLowerCase().includes(query)
    );
  }, [searchTerm, trendingArticles]);

  return (
    <div className="detail-page">
      <div className="page-shell">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/blogs">Blog</Link>
          <span>›</span>
          <span className="current">{post.title}</span>
        </nav>

        {/* Search */}
        <div className="detail-search" role="search">
          <label htmlFor="blog-search" className="sr-only">
            Search this blog
          </label>
          <div className="search-input">
            <input
              id="blog-search"
              type="search"
              value={searchTerm}
              placeholder="Search trending stories"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="button" aria-label="Search blog">
              <span>⌕</span>
            </button>
          </div>
        </div>

        <div className="content-layout">
          <main>
            <article className="article-card">
              {/* Article header */}
              <header className="article-header">
                <h1>{post.title}</h1>
                <div className="article-meta">
                  <span>by {post.author}</span>
                  <span>{post.date}</span>
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
              </header>

              {/* Featured image */}
              <figure className="featured-image">
                <img src={post.heroImage} alt={post.title} />
              </figure>

              {/* Article Body */}
              <section className="article-body">
                <p>{post.excerpt}</p>
                {post.content.map((section) => (
                  <section key={section.heading}>
                    <h2>{section.heading}</h2>
                    {section.body.map((paragraph, index) => (
                      <p key={`${section.heading}-${index}`}>{paragraph}</p>
                    ))}
                  </section>
                ))}
              </section>

              {post.tags?.length ? (
                <div className="article-tags">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
            </article>

            {/* Rating */}
            <section className="rating-section">
              <div>
                <p>Rate this article</p>
                <div className="rating-controls">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                  />
                  <span className="rating-value">{rating}/10</span>
                  <button type="button">Submit</button>
                </div>
              </div>
            </section>

            {/* Comments */}
            <section className="comments">
              <h3>Leave a Comment</h3>
              <form className="comment-form">
                <textarea placeholder="Add your comment..." rows={5} />
                <button type="submit">Submit Comment</button>
              </form>
              <div className="comment-list">
                {comments.map((comment) => (
                  <article key={comment.author}>
                    <header>
                      <strong>{comment.author}</strong>
                      <span>{comment.time}</span>
                    </header>
                    <p>{comment.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="sidebar">
            <section className="trending-widget">
              <header>
                <h4>Trending Articles</h4>
              </header>
              <div className="trending-list">
                {filteredTrending.length ? (
                  filteredTrending.map((article) => (
                    <article key={article.slug} className="trending-item">
                      <div className="thumb">
                        <img src={article.heroImage} alt={article.title} />
                      </div>
                      <div>
                        <p>{article.title}</p>
                        <span>{article.date}</span>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="empty-message">
                    No trending stories match your search.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="detail-footer">
        <div className="footer-inner">
          <div>
            <h5>About TrackPulse</h5>
            <p>
              Independent automotive reporting focused on performance launches, tech deep dives, and ownership advice.
            </p>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li>About</li>
              <li>Editorial Policy</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h5>Resources</h5>
            <ul>
              <li>Advertise</li>
              <li>Press Kit</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              <li>Help Center</li>
              <li>Community</li>
              <li>Report Issue</li>
            </ul>
          </div>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} TrackPulse Media</span>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :global(body) {
          font-family: "Inter", "Roboto", sans-serif;
          background: #f8fafc;
          color: #111827;
        }

        .detail-page {
          background: #f8fafc;
          padding: 64px 16px 48px;
        }

        .page-shell {
          max-width: 1200px;
          margin: 0 auto;
        }

        .breadcrumbs {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .breadcrumbs a {
          color: #6b7280;
        }

        .breadcrumbs .current {
          color: #111827;
        }

        .detail-search {
          margin-bottom: 20px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .search-input {
          display: flex;
          max-width: 400px;
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }

        .search-input input {
          flex: 1;
          border: none;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
        }

        .search-input button {
          width: 46px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #6b7280;
        }

        .content-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
        }

        main {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .article-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }

        .article-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .article-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #6b7280;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .featured-image {
          margin-bottom: 16px;
          border-radius: 12px;
          overflow: hidden;
          height: 360px;
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .article-body p {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .article-body h2 {
          font-size: 18px;
          font-weight: 700;
          margin: 20px 0 10px;
        }

        .article-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .article-tags span {
          font-size: 12px;
          background: #f1f5f9;
          color: #0f172a;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .rating-section,
        .comments {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }

        .rating-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
        }

        .rating-controls input {
          flex: 1;
        }

        .rating-controls button {
          background: #f02801;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
        }

        .comment-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .comment-form textarea {
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 12px;
          resize: vertical;
        }

        .comment-form button {
          align-self: flex-start;
          background: #0f172a;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 999px;
          cursor: pointer;
        }

        .comment-list article {
          border-top: 1px solid #e2e8f0;
          padding: 12px 0;
        }

        .comment-list article:first-of-type {
          border-top: none;
        }

        .comment-list header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #6b7280;
        }

        .sidebar .trending-widget {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }

        .trending-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }

        .trending-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .trending-item .thumb {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
        }

        .trending-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-footer {
          margin-top: 48px;
          padding: 40px 16px;
          background: #0f172a;
          color: #fff;
        }

        .detail-footer .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .footer-inner h5 {
          margin-bottom: 12px;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .footer-inner ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .footer-meta {
          max-width: 1200px;
          margin: 24px auto 0;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 16px;
        }

        .footer-links a {
          margin-left: 16px;
          color: #fff;
        }

        @media (max-width: 1024px) {
          .content-layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
