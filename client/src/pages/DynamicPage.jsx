/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/pages/${slug}`)
      .then(r => setPage(r.data.page))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="section"><Spinner /></div>;
  if (!page) return (
    <div className="section container" style={{ textAlign: 'center', minHeight: '50vh' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>The page you are looking for does not exist.</p>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>{page.title}</h1>
        </div>
      </div>
      <div className="container section">
        <div className="card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: '#fff' }}>
          {/* Render content dynamically. Allowing \n line breaks */}
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            {page.content}
          </div>
        </div>
      </div>
    </>
  );
}
