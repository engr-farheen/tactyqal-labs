import Parallax from '@/components/Parallax';
import { Hero, Band, Stories, Program, Why, Lesson, Tools, Quotes, BlogSection, Pricing, Faq, Contact } from '@/components/Sections';
import { getPosts } from '@/lib/api';

export const dynamic = 'force-dynamic'; // blog data comes from the API per request (cached 60s by fetch)

export default async function Home() {
  const { data } = await getPosts({ limit: 6 });
  return (
    <>
      <Parallax className="hero"><Hero /></Parallax>
      <Band /><Stories /><Program /><Why /><Lesson /><Tools /><Quotes /><BlogSection posts={data} /><Pricing /><Faq /><Contact />
    </>
  );
}
