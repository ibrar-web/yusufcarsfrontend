'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const detailPath = '/blogs/inside-the-twin-turbo-v6-that-powers-the-gtr-nismo';

const featuredMain = {
  title: 'Inside the Next-Gen EV Platforms Powering Luxury SUVs',
  excerpt:
    'We break down how modular EV skateboard platforms allow automakers to deliver longer range, smoother ride quality, and better packaging across flagship SUVs.',
  author: 'Amelia Graham',
  date: 'May 24, 2024',
  image:
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=60',
};

const featuredSecondary = [
  {
    title: 'Six-figure super sedans that still deliver daily comfort',
    image:
      'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=600&q=60',
  },
  {
    title: 'Track-focused aero kits now available for compact coupes',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=60',
  },
];

const trendingNews = [
  {
    title: '2025 Honda Civic Hybrid delivers 50 mpg combined',
    author: 'Ian Mercer',
    date: 'May 23, 2024',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=400&q=60',
  },
  {
    title: 'Bosch introduces solid-state battery cells for OEM partners',
    author: 'Maya Patel',
    date: 'May 22, 2024',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=60',
  },
  {
    title: 'Mercedes teases ultra-luxury electric G-Class interior',
    author: 'Miles Chen',
    date: 'May 21, 2024',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
  },
  {
    title: 'Pirelli launches new all-season tires for performance EVs',
    author: 'Lena Ortiz',
    date: 'May 20, 2024',
    image:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
  },
];

const articleSections = [
  {
    name: 'Latest News',
    posts: [
      {
        title: 'Ford adds BlueCruise hands-free driving to midsize lineup',
        excerpt:
          'The 1.4 update brings better lane tracing, smoother merges, and supports more kilometers of Canadian highways.',
        date: 'May 24, 2024',
        category: 'Technology',
        image:
          'https://images.unsplash.com/photo-1511910849309-0dffb8785146?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Lucid debuts tri-motor grand tourer with 1,200 hp',
        excerpt:
          'A revised aero package and new thermal management system help sustain output under track conditions.',
        date: 'May 23, 2024',
        category: 'Performance',
        image:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'European safety board toughens pedestrian impact tests',
        excerpt:
          'New test includes child dummies at intersections and expanded evaluation of bonnet deformation zones.',
        date: 'May 22, 2024',
        category: 'Safety',
        image:
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Toyota ramps up solid-state pilot line ahead of 2026 EV',
        excerpt:
          'The new facility in Aichi will validate dry coating processes before a global rollout.',
        date: 'May 21, 2024',
        category: 'Industry',
        image:
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Nissan readies software-defined cockpit for Ariya refresh',
        excerpt:
          'Expect a slimmer dash, more contextual voice controls, and user-selectable ambient themes.',
        date: 'May 20, 2024',
        category: 'Design',
        image:
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
      },
    ],
  },
  {
    name: 'Reviews',
    posts: [
      {
        title: '2024 BMW M3 Touring: wagon utility meets track pace',
        excerpt:
          'Adaptive damping and rear-biased M xDrive deliver composure over rough Alpine passes.',
        date: 'May 19, 2024',
        category: 'Road Test',
        image:
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Genesis GV60 Sport Plus long-term update',
        excerpt:
          'Battery preconditioning and new OTA infotainment suite make winter fast-charging painless.',
        date: 'May 18, 2024',
        category: 'Long-Term',
        image:
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Porsche 911 Dakar vs Lamborghini Sterrato',
        excerpt:
          'Both conquer gravel with rally tires, lifted suspensions, and unique drive modes.',
        date: 'May 17, 2024',
        category: 'Comparison',
        image:
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Volvo EX30: city-sized EV with Scandinavian calm',
        excerpt:
          'Wool blend upholstery, recycled plastics, and efficient motors make city life more serene.',
        date: 'May 16, 2024',
        category: 'First Drive',
        image:
          'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=60',
      },
    ],
  },
  {
    name: 'Tips & Advice',
    posts: [
      {
        title: 'How to prep your performance EV for track days',
        excerpt:
          'Focus on brake cooling, thermal prep cycles, and pre-session charging strategies.',
        date: 'May 15, 2024',
        category: 'Guides',
        image:
          'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Understanding over-the-air updates and data plans',
        excerpt:
          'Clarify which updates are complimentary, how to schedule installs, and data usage tips.',
        date: 'May 14, 2024',
        category: 'Ownership',
        image:
          'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Five detailing hacks to preserve matte paint finishes',
        excerpt:
          'Matte-safe shampoos, ceramic sprays, and microfiber technique keep texture intact.',
        date: 'May 13, 2024',
        category: 'Care',
        image:
          'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Choosing the right dashcam for 4K recording',
        excerpt:
          'Compare sensor sizes, HDR performance, parking modes, and cloud escalation plans.',
        date: 'May 12, 2024',
        category: 'Tech',
        image:
          'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=60',
      },
    ],
  },
  {
    name: 'Car Launches',
    posts: [
      {
        title: 'Kia previews next-gen Sorento with rugged hybrid trims',
        excerpt:
          'Chunky cladding, new plug-in hybrid powertrain, and modular roof accessories headline.',
        date: 'May 11, 2024',
        category: 'Debut',
        image:
          'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Audi urban concept rethinks city-friendly micro EV',
        excerpt:
          'Sliding doors, configurable seating, and 300 km range aim at premium commuters.',
        date: 'May 10, 2024',
        category: 'Concept',
        image:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Ram REV gets adventure-ready Tungsten Edition',
        excerpt:
          'Air suspension retune, skid plates, and integrated inverter make it campsite-ready.',
        date: 'May 9, 2024',
        category: 'Truck',
        image:
          'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=500&q=60',
      },
      {
        title: 'Hyundai Elantra N facelift sharpens aero profile',
        excerpt:
          'Revised splitter, stacked rear winglets, and new lava orange paint highlight updates.',
        date: 'May 8, 2024',
        category: 'Sedan',
        image:
          'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=500&q=60',
      },
    ],
  },
];

const sidebarTrending = [
  'Compact SUVs with best residual values',
  'Why ceramic tint matters for EVs',
  'Next-gen Supra rumored with hybrid boost',
  'DIY brake upgrades that actually work',
  'Seven-seat EVs arriving this summer',
];

const popularCars = [
  { model: 'BMW X5 M Competition', price: '$122,400' },
  { model: 'Audi RS6 Avant', price: '$118,900' },
  { model: 'Porsche Taycan 4S', price: '$104,900' },
  { model: 'Range Rover Sport PHEV', price: '$123,600' },
];

const videoHighlights = [
  {
    title: 'Wind tunnel test of the 2025 Mustang GTD aero kit',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60',
  },
  {
    title: 'Inside AMG\'s F1 facility for the C63 SE performance engine',
    image:
      'https://images.unsplash.com/photo-1511910849309-0dffb8785146?auto=format&fit=crop&w=600&q=60',
  },
];

const tags = [
  'EVs',
  'Performance',
  'Tech',
  'Luxury',
  'SUVs',
  'Motorsport',
  'Concept Cars',
  'Detailing',
  'Market Trends',
];

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedQuery = searchTerm.trim().toLowerCase();

  const trendingToRender = useMemo(() => {
    if (!normalizedQuery) return trendingNews;
    return trendingNews.filter((news) =>
      news.title.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const sectionsToRender = useMemo(() => {
    if (!normalizedQuery) return articleSections;
    return articleSections
      .map((section) => ({
        ...section,
        posts: section.posts.filter((post) =>
          post.title.toLowerCase().includes(normalizedQuery)
        ),
      }))
      .filter((section) => section.posts.length > 0);
  }, [normalizedQuery]);

  const hasResults =
    !!sectionsToRender.length || (!!normalizedQuery && trendingToRender.length);

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
      <section className="featured">
        <Link href={detailPath} className="card-link">
          <article className="featured-main">
            <div className="image-wrapper">
              <img src={featuredMain.image} alt={featuredMain.title} />
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
            <Link key={story.title} href={detailPath} className="card-link">
              <article className="secondary-card">
                <div className="image-wrapper">
                  <img src={story.image} alt={story.title} />
                </div>
                <h2>{story.title}</h2>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending news list */}
      <section className="trending">
        <h3>Trending News</h3>
        <div className="trending-list">
          {trendingToRender.length ? (
            trendingToRender.map((news) => (
              <Link key={news.title} href={detailPath} className="card-link">
                <article className="trending-row">
                  <div className="thumbnail">
                    <img src={news.image} alt={news.title} />
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
            <p className="search-empty">
              No trending headlines match your search.
            </p>
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
                  <div key={post.title}>
                    <Link href={detailPath} className="card-link">
                      <article className="post-row">
                        <div className="thumbnail">
                          <img src={post.image} alt={post.title} />
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
              <button key={page} className={page === 1 ? 'active' : ''}>
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
              {sidebarTrending.map((item, index) => (
                <li key={item}>
                  <Link href={detailPath} className="inline-link">
                    <span>{index + 1}.</span> {item}
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
                  key={video.title}
                  href={detailPath}
                  className="card-link video-card"
                >
                  <div className="video-thumb">
                    <img src={video.image} alt={video.title} />
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
                <Link key={tag} href={detailPath} className="tag-link">
                  {tag}
                </Link>
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
          font-family: 'Inter', 'Roboto', sans-serif;
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
