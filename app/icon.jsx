import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export function buildFinanceIcon(dimensions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 120,
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #0b3a2d 0%, #0f6b52 54%, #2ac58e 100%)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 24% 18%, rgba(255,255,255,0.22), transparent 26%), radial-gradient(circle at 80% 84%, rgba(203,255,232,0.18), transparent 24%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 38,
            borderRadius: 102,
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        />

        <div
          style={{
            width: 292,
            height: 192,
            display: 'flex',
            position: 'relative',
            borderRadius: 42,
            transform: 'rotate(-8deg)',
            background: 'linear-gradient(180deg, #f0fff7 0%, #b5f2d8 100%)',
            border: '6px solid rgba(7,86,71,0.2)',
            boxShadow: '0 28px 44px rgba(6,32,22,0.22)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 18,
              borderRadius: 28,
              border: '3px dashed rgba(16,112,82,0.38)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 58,
                fontWeight: 800,
                color: '#137557',
                border: '6px solid rgba(19,117,87,0.62)',
                background: 'rgba(255,255,255,0.4)',
                boxShadow: '0 10px 18px rgba(8,78,57,0.14)',
              }}
            >
              $
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: 28,
              left: 32,
              width: 58,
              height: 14,
              borderRadius: 999,
              background: 'rgba(19,117,87,0.14)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 32,
              top: 28,
              width: 58,
              height: 14,
              borderRadius: 999,
              background: 'rgba(19,117,87,0.14)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 32,
              bottom: 28,
              width: 82,
              height: 16,
              borderRadius: 999,
              background: 'rgba(19,117,87,0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 32,
              bottom: 28,
              width: 82,
              height: 16,
              borderRadius: 999,
              background: 'rgba(19,117,87,0.1)',
            }}
          />
        </div>
      </div>
    ),
    dimensions
  );
}

export default function Icon() {
  return buildFinanceIcon(size);
}
