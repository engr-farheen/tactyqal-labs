// Downloads the original full-quality images from tactyqal.com and stores them as optimised JPEGs in public/img,
// replacing the cropped copies. Run once on a machine with internet access:  npm run images:hd
import sharp from 'sharp';

const APPS = 'https://www.tactyqal.com/application/assets/img/apps/';
const BLOG = 'https://www.tactyqal.com/application/assets/images/';
const jobs = [
  ['apps/krishidrishti', APPS + 'krishidrishti1.png', 1600], ['apps/elenor', APPS + 'elenor1.png', 1600], ['apps/olc', APPS + 'olc1.png', 1600],
  ['apps/paws', APPS + 'pop1.png', 1600], ['apps/audionova', APPS + 'audionova1.png', 1600], ['apps/converza', APPS + 'converza1.png', 1600],
  ['blog/pitch', BLOG + 'blog-ele.png', 1200], ['blog/team', BLOG + 'blog-startup.png', 1200], ['blog/fail', BLOG + 'blog-fail.png', 1200],
  ['blog/nocode', BLOG + '50-No-Code-Startup-Ideas-You-Can-Build-Without-Programming-Skills.webp', 1200],
  ['blog/food', BLOG + '30-startup-ideas-for-food-waste-problems.jpg', 1200], ['blog/genz', BLOG + '50-Startup-Ideas-for-Generation-Z-Entrepreneurs.jpg', 1200],
  ['lesson', 'https://i.ytimg.com/vi/UyUH06CfLbk/maxresdefault.jpg', 1280],
];
const portraits = { aarav: 'men/65', isha: 'women/68', rohan: 'men/66', simran: 'women/69', devansh: 'men/67', priya: 'women/70' };
for (const [n, p] of Object.entries(portraits)) jobs.push([`people/${n}`, `https://randomuser.me/api/portraits/${p}.jpg`, 256]);

for (const [name, url, width] of jobs) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await sharp(Buffer.from(await res.arrayBuffer())).resize({ width, withoutEnlargement: true }).jpeg({ quality: 86, mozjpeg: true }).toFile(`public/img/${name}.jpg`);
    console.log('saved  ', name);
  } catch (e) { console.warn('skipped', name, '-', e.message); }
}
