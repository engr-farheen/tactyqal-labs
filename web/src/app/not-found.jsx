import Link from 'next/link';
export default function NotFound() {
  return <section className="sec"><div className="wrap"><h1 style={{ fontSize: '3rem' }}>Page not found</h1><p className="lead">That page does not exist or was moved.</p><Link className="btn btn-blue" style={{ marginTop: 24 }} href="/">Back to home</Link></div></section>;
}
