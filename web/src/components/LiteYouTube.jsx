'use client';
import { useState } from 'react';
import Media from './Media';

// Click-to-load YouTube player: only a poster is fetched until the visitor presses play (fast, and no tracking before consent by action).
// Without JavaScript the poster is a normal link to the video.
export default function LiteYouTube({ id, start = 0, title, art }) {
  const [on, setOn] = useState(false);
  const poster = [`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, '/img/lesson.jpg'];
  if (on) {
    return (
      <div className="thumb">
        <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&start=${start}&rel=0&modestbranding=1`} title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
    );
  }
  return (
    <a className="thumb" href={`https://www.youtube.com/watch?v=${id}&t=${start}s`} target="_blank" rel="noopener noreferrer"
      aria-label={`Play video: ${title}`} onClick={(e) => { e.preventDefault(); setOn(true); }}>
      <Media art={art} src={poster} alt="" />
      <span className="play"><svg width="30" height="30" viewBox="0 0 24 24" fill="#0B2D22" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
      <span className="ttl">{title}</span>
    </a>
  );
}
