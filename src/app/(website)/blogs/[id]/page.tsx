'use client';

import { useMemo, useState } from 'react';

const trendingArticles = [
  {
    title: 'Track-ready SUVs that still pamper on the commute',
    image:
      'https://images.unsplash.com/photo-1511910849309-0dffb8785146?auto=format&fit=crop&w=400&q=60',
  },
  {
    title: 'Next-gen solid-state packs arrive for premium EVs',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=60',
  },
  {
    title: 'Lightweight forged wheels: what to know before you buy',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
  },
  {
    title: 'Why adaptive dampers matter on broken city streets',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60',
  },
  {
    title: 'Five concept cars shaping tomorrow’s crossovers',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=60',
  },
  {
    title: 'How active aero trims drag on modern supercars',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=550&q=60',
  },
];

const comments = [
  {
    author: 'Jamie Rivera',
    body: 'Great breakdown—curious if the titanium exhaust helps reduce cabin drone at highway speeds?',
    time: '2 hours ago',
  },
  {
    author: 'Leo Kingston',
    body: 'Would love to see more data on oil temps when pushing for longer than 20 minutes.',
    time: 'Yesterday',
  },
];

export default function BlogDetailPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rating, setRating] = useState(8);

  const filteredTrending = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return trendingArticles;
    return trendingArticles.filter((article) =>
      article.title.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  return (
    <div className="detail-page">
      <div className="page-shell">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <a href="/blogs">Blog</a>
          <span>›</span>
          <span className="current">
            Inside the Twin-Turbo V6 That Powers the GT-R Nismo
          </span>
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
              placeholder="Search this blog"
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
                <h1>Inside the Twin-Turbo V6 That Powers the GT-R Nismo</h1>
                <div className="article-meta">
                  <span>by Carter Reeves</span>
                  <span>May 26, 2024</span>
                  <span>Performance Engineering</span>
                </div>
              </header>

              {/* Featured image */}
              <figure className="featured-image">
                <img
                  src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=60"
                  alt="Close-up of a performance V6 engine"
                />
              </figure>

              {/* Article Body */}
              <section className="article-body">
                <p>
                  Nissan&apos;s handcrafted VR38DETT remains one of the most
                  respected twin-turbo V6 engines thanks to obsessive machining,
                  plasma-sprayed bores, and bespoke induction packaging. The
                  latest revision for the GT-R Nismo focuses on shaving response
                  lag, managing charge temperatures, and reinforcing rotating
                  assemblies for repeated track punishment.
                </p>

                <p>
                  Engineers retuned vane geometry within the turbo housings,
                  revised ignition maps for higher cylinder pressures, and added
                  baffling inside the oil pan to prevent starvation on long,
                  high-G sweepers. These adjustments make the super coupe feel
                  more alert in tight esses without compromising daily drivability.
                </p>

                <h2>Hardware Upgrades Worth Noting</h2>
                <p>
                  New lightweight turbine wheels reduce inertia, while the
                  compressor inlet receives a smoother bellmouth transition. A
                  denser intercooler core and high-flow fuel injectors ensure the
                  VR38 breathes easier under peak boost. Nissan also reinforced
                  the connecting rods with stronger fasteners derived from GT3
                  race programs.
                </p>

                <section className="data-table" aria-label="Petrol price table">
                  <h3>Premium Petrol Price Snapshot</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Region</th>
                        <th>Before</th>
                        <th>After</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>California</td>
                        <td>$5.49 / gal</td>
                        <td>$5.86 / gal</td>
                        <td>+6.7%</td>
                      </tr>
                      <tr>
                        <td>Texas</td>
                        <td>$3.88 / gal</td>
                        <td>$4.05 / gal</td>
                        <td>+4.3%</td>
                      </tr>
                      <tr>
                        <td>Florida</td>
                        <td>$4.26 / gal</td>
                        <td>$4.41 / gal</td>
                        <td>+3.5%</td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                <figure className="inline-image">
                  <img
                    src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=60"
                    alt="Engine components laid out on a workbench"
                  />
                  <figcaption>
                    Blueprinted rotating assemblies staged for the VR38 build.
                  </figcaption>
                </figure>

                <h2>Key Takeaways for Owners</h2>
                <ul>
                  <li>
                    54% larger intercooler end tanks trim intake temps under
                    extended boost.
                  </li>
                  <li>
                    Titanium exhaust saves 6.2 kg over stainless while resisting
                    heat soak.
                  </li>
                  <li>
                    Brembo carbon-ceramic brakes pair with new sensors for live
                    rotor temp readouts.
                  </li>
                  <li>
                    Front aero revisions add 17 kg of downforce at 160 km/h with
                    only a slight drag penalty.
                  </li>
                </ul>

                <p>
                  These upgrades arrived after Nissan&apos;s durability program
                  simulated 300 Fuji Speedway laps per engine. Oil temps stayed
                  within a tight window thanks to a higher-capacity scavenge
                  pump and baffled sump, keeping the VR38 cool when hammered lap
                  after lap.
                </p>

                <h2>Conclusion</h2>
                <p>
                  The 2024 GT-R Nismo preserves its relentless character while
                  sharpening responses in the areas that matter most to track
                  faithful drivers. With strong aftermarket support and factory
                  reliability, it remains one of the last analog-feeling
                  supercars you can still order today.
                </p>
              </section>
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
                    <article key={article.title} className="trending-item">
                      <div className="thumb">
                        <img src={article.image} alt={article.title} />
                      </div>
                      <p>{article.title}</p>
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
              Independent automotive reporting focused on performance launches,
              tech deep dives, and ownership advice.
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
          font-family: 'Inter', 'Roboto', sans-serif;
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

        .article-body ul {
          margin: 0 0 16px;
          padding-left: 18px;
        }

        .article-body li {
          margin-bottom: 8px;
        }

        .data-table {
          margin: 20px 0;
        }

        .data-table h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th,
        td {
          border: 1px solid #e5e7eb;
          padding: 10px 12px;
          text-align: left;
        }

        th {
          background: #f3f4f6;
        }

        .inline-image {
          margin: 20px 0;
          border-radius: 12px;
          overflow: hidden;
        }

        .inline-image img {
          width: 100%;
          height: 280px;
          object-fit: cover;
        }

        .inline-image figcaption {
          font-size: 13px;
          color: #6b7280;
          padding: 8px 0;
        }

        .rating-section {
          display: flex;
          justify-content: flex-end;
          padding: 16px 24px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }

        .rating-section p {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .rating-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rating-controls input {
          width: 200px;
          accent-color: #dc2626;
        }

        .rating-value {
          font-weight: 600;
          color: #dc2626;
        }

        .rating-controls button {
          background: #dc2626;
          border: none;
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .comments {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }

        .comments h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }

        .comment-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .comment-form textarea {
          border-radius: 12px;
          border: 1px solid #d1d5db;
          padding: 12px;
          font-size: 14px;
          font-family: inherit;
        }

        .comment-form button {
          align-self: flex-start;
          background: #dc2626;
          border: none;
          color: #fff;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .comment-list article {
          border-top: 1px solid #e5e7eb;
          padding: 12px 0;
        }

        .comment-list article:first-of-type {
          border-top: none;
          padding-top: 0;
        }

        .comment-list header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #6b7280;
        }

        .comment-list p {
          margin-top: 4px;
          font-size: 14px;
        }

        .sidebar {
          position: sticky;
          top: 24px;
          align-self: flex-start;
        }

        .trending-widget {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }

        .trending-widget header h4 {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          border-bottom: 2px solid #dc2626;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        .trending-item {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          align-items: center;
        }

        .trending-item:last-child {
          margin-bottom: 0;
        }

        .thumb {
          width: 80px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .trending-item p {
          font-size: 14px;
          font-weight: 600;
        }

        .empty-message {
          font-size: 13px;
          color: #6b7280;
        }

        .detail-footer {
          background: #0f172a;
          color: #cbd5e1;
          margin-top: 40px;
          padding: 32px 16px;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .footer-inner h5 {
          color: #f8fafc;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .footer-inner ul {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 13px;
        }

        .footer-inner li {
          margin-bottom: 6px;
        }

        .footer-meta {
          max-width: 1200px;
          margin: 16px auto 0;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-links a {
          color: #cbd5e1;
          margin-left: 12px;
          font-size: 12px;
        }

        @media (max-width: 1024px) {
          .content-layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .detail-page {
            padding: 48px 12px 32px;
          }

          .breadcrumbs {
            font-size: 11px;
          }

          .featured-image {
            height: 300px;
          }

          .thumb {
            width: 110px;
            height: 70px;
          }

          .rating-controls input {
            width: 160px;
          }

          .comment-form button,
          .rating-controls button {
            width: 100%;
            text-align: center;
          }

          .footer-inner {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .featured-image {
            height: 240px;
          }

          .footer-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
