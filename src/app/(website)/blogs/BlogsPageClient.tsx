"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogSummary } from "@/data/blog-posts";

const sectionNames = [
  "Latest News",
  "Reviews",
  "Tips & Advice",
  "Car Launches",
] as const;

const popularCars = [
  { model: "BMW X5 M Competition", price: "£122,400" },
  { model: "Audi RS6 Avant", price: "£118,900" },
  { model: "Porsche Taycan 4S", price: "£104,900" },
  { model: "Range Rover Sport PHEV", price: "£123,600" },
];

const tags = [
  "EVs",
  "Performance",
  "Tech",
  "Luxury",
  "SUVs",
  "Motorsport",
  "Concept Cars",
  "Detailing",
  "Market Trends",
];

const detailPath = (slug: string) => `/blogs/${slug}`;

type BlogsPageClientProps = {
  posts: BlogSummary[];
};

export function BlogsPageClient({ posts }: BlogsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedQuery = searchTerm.trim().toLowerCase();

  const featuredMain = useMemo(
    () => posts.find((post) => post.featured === "main") ?? posts[0],
    [posts]
  );

  const featuredSecondary = useMemo(
    () => posts.filter((post) => post.featured === "secondary").slice(0, 2),
    [posts]
  );

  const trendingNews = useMemo(
    () => posts.filter((post) => post.trending).slice(0, 4),
    [posts]
  );

  const trendingArticles = useMemo(
    () =>
      [...posts]
        .filter((post) => typeof post.sidebarRank === "number")
        .sort(
          (a, b) => (a.sidebarRank ?? Number.MAX_SAFE_INTEGER) - (b.sidebarRank ?? Number.MAX_SAFE_INTEGER)
        )
        .slice(0, 5),
    [posts]
  );

  const sectionsToRender = useMemo(() => {
    const baseSections = sectionNames
      .map((name) => ({
        name,
        posts: posts.filter((post) => post.section === name),
      }))
      .filter((section) => section.posts.length > 0);

    if (!normalizedQuery) {
      return baseSections;
    }

    return baseSections
      .map((section) => ({
        ...section,
        posts: section.posts.filter((post) =>
          post.title.toLowerCase().includes(normalizedQuery)
        ),
      }))
      .filter((section) => section.posts.length > 0);
  }, [posts, normalizedQuery]);

  const trendingToRender = useMemo(() => {
    if (!normalizedQuery) {
      return trendingNews;
    }
    return trendingNews.filter((news) =>
      news.title.toLowerCase().includes(normalizedQuery)
    );
  }, [trendingNews, normalizedQuery]);

  const hasResults =
    sectionsToRender.length > 0 || (!!normalizedQuery && trendingToRender.length > 0);

  const videoHighlights = useMemo(
    () => posts.filter((post) => post.videoHighlight).slice(0, 3),
    [posts]
  );

  const handleTagClick = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="blog-page">
      <section className="tools" aria-label="Blog search">
        <div className="search-field">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search blogs"
          />
          <button type="button" aria-label="Search">
            <span>⌕</span>
          </button>
        </div>
        {normalizedQuery && !hasResults ? (
          <p className="search-empty">
            No posts match “{searchTerm}”. Clear search to see all stories.
          </p>
        ) : null}
      </section>

      {/* Featured slider / top stories */}
      {featuredMain && (
        <section className="featured">
          <Link href={detailPath(featuredMain.slug)} className="card-link">
            <article className="featured-main">
              <div className="image-wrapper">
                <img src={featuredMain.heroImage} alt={featuredMain.title} />
              </div>
              <div className="featured-content">
                <h1>{featuredMain.title}</h1>
                <p>{featuredMain.excerpt}</p>
                <span className="meta">
                  {featuredMain.author} • {featuredMain.date}
                </span>
                <span className="view-details">View Details</span>
              </div>
            </article>
          </Link>
          <div className="featured-secondary">
            {featuredSecondary.map((story) => (
              <Link
                key={story.slug}
                href={detailPath(story.slug)}
                className="card-link"
              >
                <article className="secondary-card">
                  <div className="image-wrapper">
                    <img src={story.heroImage} alt={story.title} />
                  </div>
                  <h2>{story.title}</h2>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending news list */}
      <section className="trending">
        <h3>Trending News</h3>
        <div className="trending-list">
          {trendingToRender.length ? (
            trendingToRender.map((news) => (
              <Link
                key={news.slug}
                href={detailPath(news.slug)}
                className="card-link"
              >
                <article className="trending-row">
                  <div className="thumbnail">
                    <img src={news.heroImage} alt={news.title} />
                  </div>
                  <div className="trending-body">
                    <h4>{news.title}</h4>
                    <p>
                      {news.author} • {news.date}
                    </p>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <p className="search-empty">No trending headlines match your search.</p>
          )}
        </div>
      </section>

      <div className="layout">
        <main>
          {/* Recent posts sections */}
          {sectionsToRender.map((section) => (
            <section key={section.name} className="article-section">
              <header>
                <h5>{section.name}</h5>
              </header>
              <div className="section-list">
                {section.posts.map((post, index) => (
                  <div key={post.slug}>
                    <Link
                      href={detailPath(post.slug)}
                      className="card-link"
                    >
                      <article className="post-row">
                        <div className="thumbnail">
                          <img src={post.heroImage} alt={post.title} />
                        </div>
                        <div className="post-content">
                          <h6>{post.title}</h6>
                          <p>{post.excerpt}</p>
                          <span className="meta">
                            {post.date} • {post.category}
                          </span>
                        </div>
                      </article>
                    </Link>
                    <div className="divider" />
                    {(index + 1) % 4 === 0 && (
                      <div className="ad-slot">Advertisement</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Pagination */}
          <nav className="pagination">
            {[1, 2, 3, 4].map((page) => (
              <button key={page} className={page === 1 ? "active" : ""}>
                {page}
              </button>
            ))}
          </nav>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="widget">
            <h4>Trending Articles</h4>
            <ol>
              {trendingArticles.map((item, index) => (
                <li key={item.slug}>
                  <Link
                    href={detailPath(item.slug)}
                    className="inline-link"
                  >
                    <span>{index + 1}.</span> {item.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="widget">
            <h4>Popular Cars</h4>
            <div className="popular-cars">
              {popularCars.map((car) => (
                <div key={car.model} className="car-row">
                  <span>{car.model}</span>
                  <strong>{car.price}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="widget">
            <h4>Video Highlights</h4>
            <div className="video-list">
              {videoHighlights.map((video) => (
                <Link
                  key={video.slug}
                  href={detailPath(video.slug)}
                  className="card-link video-card"
                >
                  <div className="video-thumb">
                    <img src={video.heroImage} alt={video.title} />
                  </div>
                  <p>{video.title}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="widget newsletter">
            <h4>Newsletter</h4>
            <p>Weekly summaries on launches, tech, and insider scoops.</p>
            <form>
              <input type="email" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          <div className="widget tags">
            <h4>Popular Tags</h4>
            <div className="tag-list">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="tag-link"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <h4>About DriveLive</h4>
            <p>
              Deep dives on electrification, performance, and the stories behind
              the cars that move us.
            </p>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li>Advertise</li>
              <li>Editorial Policy</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li>Instagram</li>
              <li>YouTube</li>
              <li>LinkedIn</li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>Privacy</li>
              <li>Terms</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} DriveLive Media</span>
          <div>
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :global(body) {
          font-family: "Inter", "Roboto", sans-serif;
          background: #f8fafc;
          color: #111827;
        }

        .blog-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 16px 48px;
          font-size: 14px;
          line-height: 1.5;
        }

        .tools {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .search-field {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 420px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        }

        .search-field input {
          flex: 1;
          border: none;
          padding: 12px;
          font-size: 14px;
          outline: none;
        }

        .search-field button {
          width: 48px;
          height: 48px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          color: #6b7280;
        }

        .search-empty {
          font-size: 13px;
          color: #dc2626;
        }

        .featured {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 16px;
          width: 100%;
          margin-bottom: 24px;
        }

        .card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          cursor: pointer;
        }

        .inline-link {
          text-decoration: none;
          color: #111827;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        .view-details {
          margin-top: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #dc2626;
        }

        .featured-main,
        .secondary-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }

        .featured-main:hover,
        .secondary-card:hover {
          transform: scale(1.01);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
        }

        .featured-main .image-wrapper {
          height: 280px;
        }

        .featured-main img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .featured-content {
          padding: 16px;
        }

        .featured-content h1 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #111827;
        }

        .featured-content p {
          color: #6b7280;
          margin-bottom: 6px;
        }

        .featured-secondary {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .secondary-card .image-wrapper {
          height: 120px;
        }

        .secondary-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .secondary-card h2 {
          font-size: 15px;
          font-weight: 700;
          padding: 12px;
          color: #111827;
        }

        .meta {
          font-size: 12px;
          color: #6b7280;
        }

        .trending {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 32px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        .trending h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .trending-row {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .trending-row:last-child {
          border-bottom: none;
        }

        .thumbnail {
          width: 140px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .trending-body h4 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .trending-body p {
          font-size: 12px;
          color: #6b7280;
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
        }

        main section + section {
          margin-top: 32px;
        }

        .article-section header h5 {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          border-bottom: 2px solid #dc2626;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }

        .post-row {
          display: flex;
          gap: 12px;
          padding: 12px 0;
        }

        .post-content h6 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .post-content p {
          margin-bottom: 4px;
          color: #6b7280;
        }

        .divider {
          height: 1px;
          background: #e5e7eb;
        }

        .ad-slot {
          height: 90px;
          border-radius: 12px;
          background: #e5e7eb;
          color: #6b7280;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 12px 0;
        }

        .pagination {
          display: flex;
          gap: 8px;
          margin-top: 24px;
        }

        .pagination button {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          font-weight: 600;
        }

        .pagination .active {
          background: #dc2626;
          color: #fff;
          border-color: #dc2626;
        }

        .sidebar {
          position: sticky;
          top: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 320px;
          height: fit-content;
        }

        .widget {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        .widget h4 {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .widget ol {
          padding-left: 16px;
          margin: 0;
          color: #111827;
        }

        .widget li {
          margin-bottom: 6px;
          font-size: 14px;
          color: #111827;
        }

        .popular-cars .car-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }

        .popular-cars .car-row:last-child {
          border-bottom: none;
        }

        .video-card {
          margin-bottom: 12px;
        }

        .video-thumb {
          width: 100%;
          padding-top: 56.25%;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .video-thumb img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-card p {
          margin-top: 6px;
          font-size: 13px;
          color: #111827;
        }

        .newsletter form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .newsletter input {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 10px;
        }

        .newsletter button {
          background: #dc2626;
          border: none;
          color: #fff;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag-link {
          padding: 6px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          font-size: 12px;
          text-decoration: none;
          color: #111827;
          display: inline-flex;
          cursor: pointer;
        }

        .site-footer {
          margin-top: 48px;
          background: #0f172a;
          color: #cbd5e1;
          border-radius: 12px;
          padding: 32px;
        }

        .footer-inner {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          font-size: 13px;
        }

        .footer-inner h4 {
          color: #f8fafc;
          margin-bottom: 8px;
        }

        .footer-inner ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-inner li {
          margin-bottom: 4px;
        }

        .footer-meta {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-meta a {
          margin-left: 12px;
          color: #cbd5e1;
        }

        @media (max-width: 1024px) {
          .featured {
            grid-template-columns: 1fr;
          }

          .layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .blog-page {
            padding: 16px 12px 32px;
          }

          .thumbnail {
            width: 110px;
            height: 70px;
          }

          .featured-main .image-wrapper {
            height: 220px;
          }

          .secondary-card .image-wrapper {
            height: 110px;
          }

          .pagination button {
            width: 32px;
            height: 32px;
          }

          .footer-inner {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .post-row,
          .trending-row {
            flex-direction: row;
          }

          .post-content h6 {
            font-size: 15px;
          }

          .footer-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
