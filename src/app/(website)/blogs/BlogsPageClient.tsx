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
              Deep dives on electrification, performance, and the stories behind the cars that move us.
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
        </div>
      </footer>
    </div>
  );
}
