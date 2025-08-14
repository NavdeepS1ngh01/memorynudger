import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        Welcome to Memory Nudger
      </h1>
      <p style={{ marginTop: '10px', fontSize: '1.1rem', color: '#555' }}>
        Keep your memory bites fresh and never forget the sparks.
      </p>
      <Link href="/auth">
        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '5px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Go to Auth Page
        </button>
      </Link>
    </main>
  );
}
