import { createApp } from './app.js';
import { migrate } from './db.js';
import { seedIfEmpty } from './seed.js';

await migrate();
if (process.env.SEED !== 'false' && (await seedIfEmpty())) console.log('Seeded sample posts');
const port = process.env.PORT || 4000;
createApp().listen(port, () => console.log(`Tactyqal Labs running on http://localhost:${port}`));
