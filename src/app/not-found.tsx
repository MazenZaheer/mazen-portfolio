import TransitionLink from '@/components/TransitionLink';

export default function NotFound() {
  return (
    <section
      className="container"
      id="top"
      style={{ minHeight: '80vh', display: 'grid', alignContent: 'center', gap: 24, paddingTop: 'var(--nav-h)' }}
    >
      <p className="eyebrow">
        <b>404</b> · No signal
      </p>
      <h1 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(56px, 10vw, 160px)', lineHeight: 0.9 }}>
        This channel is empty.
      </h1>
      <div>
        <TransitionLink href="/" className="btn">
          Back to the homepage →
        </TransitionLink>
      </div>
    </section>
  );
}
