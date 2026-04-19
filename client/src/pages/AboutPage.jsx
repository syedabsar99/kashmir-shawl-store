/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import { Link } from 'react-router-dom';
import useSettingsStore from '../store/settingsStore';

export default function AboutPage() {
  const settings = useSettingsStore();
  const data = settings.aboutPage || {};

  return (
    <div style={{ background: '#111', color: 'var(--white)', minHeight: '100vh', opacity: settings.isInitialized ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      {/* Cinematic Hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${data.heroImage || 'https://images.unsplash.com/photo-1549463991-032899479b00?w=1600&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6 }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111, rgba(17,17,17,0.5))' }}></div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          <p style={{ letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)', fontSize: '11px', fontWeight: 700, marginBottom: '24px' }}>
            {data.heroSubtitle || 'The Heritage of the Himalayas'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px, 8vw, 84px)', color: 'var(--white)', lineHeight: 1.1, marginBottom: '24px' }}>
            {data.heroTitle || 'Artistry Without Compromise'}
          </h1>
        </div>
      </div>

      {/* Chapter I: The Origin */}
      <section className="section" style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', marginBottom: '32px', lineHeight: 1.2 }} dangerouslySetInnerHTML={{__html: (data.chapterTitle || 'Chapter I. <br/>A Journey to Creation').replace('\\n', '<br/>') }}></h2>
              <p style={{ color: 'var(--gray-300)', lineHeight: 1.9, fontSize: '16px', marginBottom: '24px' }}>
                {data.chapterText1 || 'At Saadat Shawl House, we do not merely sell garments; we are the modern custodians of an ancient craft.'}
              </p>
              <p style={{ color: 'var(--gray-300)', lineHeight: 1.9, fontSize: '16px' }}>
                {data.chapterText2 || 'True luxury takes time. From the perilous high altitudes where the finest Cashmere is hand-combed, to the rhythmic clicking of the handlooms.'}
              </p>
            </div>
            <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
              <img src={data.chapterImage || 'https://images.unsplash.com/photo-1621217036239-0efc23579dc5?w=1000&q=80'} alt="Artisan" style={{ width: '100%', display: 'block', filter: 'grayscale(30%) contrast(1.1)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Quote */}
      <section style={{ padding: '120px 20px', background: 'var(--crimson)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <svg style={{ width: '40px', height: '40px', opacity: 0.5, margin: '0 auto 32px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.5, fontWeight: 400 }}>
            {data.quoteText || '"We believe that a masterpiece cannot be rushed... "'}
          </h3>
        </div>
      </section>

      {/* Stats / Final Call */}
      <section className="section" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container text-center">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '100px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', color: 'var(--gold)', marginBottom: '8px' }}>{data.stat1Num || '300+'}</div>
              <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray-300)' }}>{data.stat1Label || 'Artisan Weavers'}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', color: 'var(--gold)', marginBottom: '8px' }}>{data.stat2Num || '100%'}</div>
              <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray-300)' }}>{data.stat2Label || 'GI-Certified'}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', color: 'var(--gold)', marginBottom: '8px' }}>{data.stat3Num || '1952'}</div>
              <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray-300)' }}>{data.stat3Label || 'Established'}</div>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', marginBottom: '32px' }}>Experience The Legacy Today.</h2>
          <Link to="/shop" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--gold)', color: 'var(--gold)', padding: '18px 48px', fontSize: '16px' }}>
            Explore Our Collections
          </Link>
        </div>
      </section>
    </div>
  );
}
