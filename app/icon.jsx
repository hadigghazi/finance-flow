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
          background: 'linear-gradient(160deg, #0b2f44 0%, #0d6788 55%, #12a57a 100%)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 22% 18%, rgba(255,255,255,0.2), transparent 28%), radial-gradient(circle at 84% 88%, rgba(188,255,233,0.18), transparent 26%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 78,
            left: 78,
            width: 356,
            height: 356,
            borderRadius: 104,
            border: '1px solid rgba(255,255,255,0.16)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 116,
            left: 136,
            width: 240,
            height: 152,
            display: 'flex',
            borderRadius: 34,
            transform: 'rotate(-6deg)',
            background: 'linear-gradient(180deg, #d8fff0 0%, #8be3c2 100%)',
            border: '4px solid rgba(7,86,71,0.28)',
            boxShadow: '0 20px 28px rgba(6,32,48,0.2)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 14,
              borderRadius: 24,
              border: '3px dashed rgba(16,112,82,0.48)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 44,
              left: 92,
              width: 56,
              height: 56,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 800,
              color: '#127759',
              border: '4px solid rgba(18,119,89,0.7)',
              background: 'rgba(255,255,255,0.3)',
            }}
          >
            $
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 104,
            bottom: 112,
            width: 304,
            height: 170,
            display: 'flex',
            borderRadius: 46,
            background: 'linear-gradient(180deg, #ffffff 0%, #d6ebf5 100%)',
            boxShadow: '0 24px 36px rgba(6,24,38,0.22)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 18,
              borderRadius: 32,
              border: '3px solid rgba(13,103,136,0.18)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 34,
              left: 40,
              width: 56,
              height: 14,
              borderRadius: 999,
              background: 'rgba(11,47,68,0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 44,
              bottom: 34,
              width: 74,
              height: 18,
              borderRadius: 999,
              background: 'rgba(11,47,68,0.08)',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 106,
            bottom: 90,
            width: 92,
            height: 92,
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            fontWeight: 800,
            color: '#8b5a00',
            background: 'linear-gradient(180deg, #ffe8a6 0%, #f6c445 100%)',
            border: '6px solid rgba(255,255,255,0.72)',
            boxShadow: '0 18px 24px rgba(94,63,7,0.22)',
          }}
        >
          $
        </div>
      </div>
    ),
    dimensions
  );
}

export default function Icon() {
  return buildFinanceIcon(size);
}
