'use client';

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
];

export default function BlogDetailPage() {
  return (
    <div className="blog-detail-page">
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

        <div className="content-layout">
          <main>
            {/* Article header */}
            <header className="article-header">
              <p className="category-pill">Performance</p>
              <h1>Inside the Twin-Turbo V6 That Powers the GT-R Nismo</h1>
              <div className="article-meta">
                <span>by Carter Reeves</span>
                <span>May 26, 2024</span>
                <span>GT-R Platform</span>
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
            <article className="article-body">
              <p>
                Nissan&apos;s handcrafted VR38DETT has evolved into one of the
                most iconic powerplants in motorsport and tuner circles. For the
                latest GT-R Nismo, engineers revisited the turbo geometry,
                charge cooling layout, and conrod metallurgy to unlock sharper
                throttle response while sustaining heat cycles for track
                sessions.
              </p>

              <p>
                This detail review breaks down what changed inside the block,
                how aerodynamic tweaks reduce front-end lift, and what owners
                should look for if they plan to pursue 700+ horsepower builds on
                pump fuel. We also compare the price of premium petrol before
                and after the latest excise as it impacts long-distance touring
                budgets.
              </p>

              <h2>Revised Turbo Hardware</h2>
              <p>
                New turbine wheels use a thinner blade profile with a
                lightweight hub that reduces rotational mass by 14 percent.
                Combined with a reshaped volute, the turbos hit peak boost 400
                rpm sooner without sacrificing top-end flow. Nissan kept the
                stock boost target for warranty purposes, but left ample headroom
                for ECU recalibrations.
              </p>

              {/* Inline comparison table */}
              <section className="data-table">
                <h3>Premium Petrol Price Snapshot</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Before Hike</th>
                      <th>After Hike</th>
                      <th>Difference</th>
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

              {/* Inline image */}
              <figure className="inline-image">
                <img
                  src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=60"
                  alt="Engine components laid out on a workbench"
                />
                <figcaption>
                  Precision-balanced rotating assemblies ready for the VR38
                  build.
                </figcaption>
              </figure>

              <h2>Highlights for Owners</h2>
              <ul>
                <li>54 percent larger intercooler end tanks promote airflow.</li>
                <li>
                  Titanium exhaust saves 6.2 kg over the previous stainless
                  system.
                </li>
                <li>
                  Brembo carbon-ceramic rotors now include temperature sensors
                  that sync with the digital dash.
                </li>
                <li>
                  Reprofiled front fascia trims drag by 7 counts while adding 17
                  kg of downforce at 160 km/h.
                </li>
              </ul>

              <p>
                These hardware changes meet strict endurance targets. Nissan ran
                each engine on full-throttle cycles equivalent to 300 laps of
                Fuji Speedway, ensuring oil temperatures stayed below 120 °C
                with the upgraded baffled sump and scavenge pumps.
              </p>

              <h2>Final Thoughts</h2>
              <p>
                Enthusiasts craving factory reliability with tuning potential
                will find the 2024 GT-R Nismo engine refresh strikes the right
                balance. It leaves enough headroom to explore flex-fuel and
                upgraded turbos while keeping drivability intact for city duty.
                Expect early allocations to sell fast as production caps remain
                tight.
              </p>
            </article>

            {/* Comments Section */}
            <section className="comments">
              <h3>Leave a Comment</h3>
              <div className="comment-list">
                <article>
                  <h4>Jamie Rivera</h4>
                  <p>
                    Great breakdown—curious if the titanium exhaust helps reduce
                    cabin drone at highway speeds?
                  </p>
                </article>
              </div>
              <form className="comment-form">
                <label htmlFor="comment">Share your thoughts</label>
                <textarea
                  id="comment"
                  placeholder="Add your comment..."
                  rows={5}
                />
                <button type="submit">Submit Comment</button>
              </form>
            </section>
          </main>

          {/* Trending sidebar */}
          <aside className="sidebar">
            <section className="trending-widget">
              <header>
                <h4>Trending Articles</h4>
              </header>
              <div className="trending-list">
                {trendingArticles.map((article) => (
                  <article key={article.title} className="trending-item">
                    <div className="thumb">
                      <img src={article.image} alt={article.title} />
                    </div>
                    <div>
                      <p>{article.title}</p>
                    </div>
                  </article>
                ))}
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

        .blog-detail-page {
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
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .breadcrumbs a {
          color: #6b7280;
        }

        .breadcrumbs .current {
          color: #111827;
        }

        .content-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
        }

        main {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }

        .article-header .category-pill {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          background: #fee2e2;
          color: #dc2626;
          font-size: 12px;
          font-weight: 600;
        }

        .article-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 12px 0;
        }

        .article-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #6b7280;
          flex-wrap: wrap;
        }

        .featured-image {
          margin: 24px 0;
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
          color: #111827;
        }

        .article-body h2 {
          font-size: 18px;
          font-weight: 700;
          margin: 24px 0 12px;
        }

        .article-body ul {
          padding-left: 18px;
          margin-bottom: 16px;
        }

        .article-body li {
          margin-bottom: 8px;
        }

        .data-table {
          margin: 24px 0;
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
          padding: 12px;
          text-align: left;
        }

        th {
          background: #f3f4f6;
          font-weight: 600;
        }

        .inline-image {
          margin: 24px 0;
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

        .comments {
          margin-top: 48px;
        }

        .comments h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .comment-list article {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .comment-list h4 {
          font-size: 14px;
          margin-bottom: 6px;
        }

        .comment-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .comment-form textarea {
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px;
          font-family: inherit;
        }

        .comment-form button {
          align-self: flex-start;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-weight: 600;
          cursor: pointer;
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
        }

        .trending-item:last-child {
          margin-bottom: 0;
        }

        .trending-item .thumb {
          width: 80px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .trending-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .trending-item p {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .detail-footer {
          background: #0f172a;
          margin-top: 40px;
          color: #cbd5e1;
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
          margin-left: 16px;
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
          .blog-detail-page {
            padding: 48px 12px 32px;
          }

          main {
            padding: 20px;
          }

          .breadcrumbs {
            font-size: 11px;
          }

          .trending-item .thumb {
            width: 110px;
            height: 70px;
          }

          .comment-form button {
            width: 100%;
            text-align: center;
          }

          .footer-inner {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .footer-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
