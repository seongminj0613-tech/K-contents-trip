'use client';

import { useRouter } from 'next/navigation';

const durationOptions = [
  'Half day',
  'One day trip',
  '1 night, 2 days',
  '2 nights, 3 days or more'
];

export default function DurationPage() {
  const router = useRouter();

  const handleSelectDuration = (duration: string) => {
    localStorage.setItem('selectedDuration', duration);
    router.push('/style');
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #020617 0%, #000000 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '32px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '12px',
            lineHeight: 1.3,
          }}
        >
          How long will you stay in Busan?
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.72)',
            marginBottom: '24px',
            lineHeight: 1.6,
            fontSize: '12px',
          }}
        >
           Select your travel duration and we’ll recommend a course that fits your schedule.
        </p>

        <div
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          {durationOptions.map((duration) => (
            <button
              key={duration}
              onClick={() => handleSelectDuration(duration)}
              style={{
                padding: '20px',
                borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {duration}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}