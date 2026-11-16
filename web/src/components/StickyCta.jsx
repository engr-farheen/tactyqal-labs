'use client';
import { useEffect, useState } from 'react';
import { BOOK } from '@/lib/data';
import { ic, I } from '@/lib/art';

// Floating "Book Free Consultation" bar: appears after the hero, hides while the contact form is on screen.
export default function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let hide = false;
    const update = () => setShow(scrollY > 520 && !hide);
    const contact = document.getElementById('contact');
    const io = contact && new IntersectionObserver(([e]) => { hide = e.isIntersecting; update(); }, { threshold: 0.15 });
    io?.observe(contact); addEventListener('scroll', update, { passive: true }); update();
    return () => { removeEventListener('scroll', update); io?.disconnect(); };
  }, []);
  return (
    <aside aria-label="Book a consultation" className={`sticky${show ? " show" : ""}`}>
      <a className="btn" href={BOOK} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1}>
        <span>Book Free Consultation</span><span dangerouslySetInnerHTML={{ __html: ic(I.arrow) }} />
      </a>
    </aside>
  );
}
