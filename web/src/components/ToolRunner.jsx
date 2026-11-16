'use client';
import { useEffect, useRef } from 'react';
import { mountTool } from '@/lib/tool-runner';
import { bySlug } from '@/lib/tools';

export default function ToolRunner({ slug, bookUrl }) {
  const ref = useRef(null);
  useEffect(() => mountTool(ref.current, bySlug(slug), { bookUrl }), [slug, bookUrl]);
  return <div ref={ref} className="tool-box" />;
}
