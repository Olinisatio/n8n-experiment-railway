import { ImageResponse } from 'next/og';

export const alt = 'Setting Boundaries — find where you go quiet, and what to say instead';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The share card. Same palette as the page, set in Fraunces where we can get
 * it — the font is fetched at build time and the card falls back to the
 * built-in face if that fetch fails, because a missing OG image is a worse
 * outcome than a slightly plainer one.
 */
async function frauncesData(): Promise<ArrayBuffer | null> {
  try {
    // Requesting without a modern user-agent makes Google Fonts serve TTF
    // rather than woff2, which is the format satori can actually parse.
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    ).then((response) => response.text());

    const url = css.match(/src:\s*url\((https:\/\/[^)]+\.(?:ttf|otf))\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((response) => response.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const fraunces = await frauncesData();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F5EFE6',
          color: '#3D3229',
          padding: '72px 80px',
          fontFamily: fraunces ? 'Fraunces' : 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#6B5D50',
          }}
        >
          Quiet Parts
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 104, lineHeight: 1.05, letterSpacing: -2 }}>
            Setting Boundaries
          </div>
          <div style={{ display: 'flex', height: 3, width: 220, background: '#A67C52', marginTop: 28 }} />
          <div style={{ display: 'flex', fontSize: 38, color: '#6B5D50', marginTop: 28 }}>
            Find where you go quiet — and what to say instead.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 24, color: '#6B5D50' }}>
          Eight questions about one person · Free · Nothing is stored
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fraunces
        ? [{ name: 'Fraunces', data: fraunces, style: 'normal', weight: 600 as const }]
        : undefined,
    },
  );
}
