'use client';
export default function Error({ reset }) {
  return (
    <section className="sec"><div className="wrap">
      <h1 style={{ fontSize: '3rem' }}>Something went wrong</h1>
      <p className="lead">Please try again. If it keeps happening, email tactyqal.labs@gmail.com.</p>
      <button className="btn btn-dark" style={{ marginTop: 24 }} onClick={() => reset()}><span>Try again</span></button>
    </div></section>
  );
}
