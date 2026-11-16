export default function Loading() {
  return <section className="sec" style={{ paddingTop: 0 }}><div className="wrap" aria-busy="true"><div className="pagehead"><div className="skel" style={{ height: 56, width: '60%' }} /></div>
    <div className="posts">{[0, 1, 2].map((i) => <div key={i} className="skel" style={{ height: 300 }} />)}</div></div></section>;
}
