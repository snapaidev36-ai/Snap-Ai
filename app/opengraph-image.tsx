import { ImageResponse } from 'next/og';

import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const runtime = 'edge';

export const alt = `${SITE_NAME} social preview`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '72px',
        background:
          'radial-gradient(circle at top left, rgba(16, 185, 129, 0.26), transparent 34%), linear-gradient(135deg, #04111a 0%, #0b1724 48%, #0f2a24 100%)',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          maxWidth: '720px',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}>
          <div
            style={{
              display: 'flex',
              width: '104px',
              height: '104px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '28px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: '0 18px 50px rgba(0, 0, 0, 0.28)',
              fontSize: '42px',
              fontWeight: 700,
              letterSpacing: '-0.06em',
            }}>
            SA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '-0.04em',
              }}>
              {SITE_NAME}
            </div>
            <div
              style={{
                color: 'rgba(226, 232, 240, 0.82)',
                fontSize: '16px',
              }}>
              AI powered image builder
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: '68px',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.06em',
            maxWidth: '900px',
          }}>
          Generate, explore, and manage polished AI images.
        </div>

        <div
          style={{
            maxWidth: '640px',
            fontSize: '28px',
            lineHeight: 1.35,
            color: 'rgba(226, 232, 240, 0.86)',
          }}>
          {SITE_DESCRIPTION}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignSelf: 'stretch',
          justifyContent: 'flex-end',
          width: '280px',
        }}>
        <div
          style={{
            borderRadius: '28px',
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 18px 50px rgba(0, 0, 0, 0.24)',
          }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              marginBottom: '10px',
            }}>
            Prompt studio
          </div>
          <div
            style={{
              fontSize: '15px',
              lineHeight: 1.5,
              color: 'rgba(226, 232, 240, 0.86)',
            }}>
            Shape ideas, generate results, and keep your best work organized.
          </div>
        </div>

        <div
          style={{
            borderRadius: '28px',
            padding: '24px',
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(14, 165, 233, 0.88))',
            color: '#f8fafc',
            boxShadow: '0 18px 50px rgba(16, 185, 129, 0.22)',
          }}>
          <div
            style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>
            Fast workflow
          </div>
          <div style={{ fontSize: '15px', lineHeight: 1.5, opacity: 0.95 }}>
            Built for creation, browsing, and billing at scale.
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
