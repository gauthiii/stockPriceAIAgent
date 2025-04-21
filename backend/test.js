import { getTodayPrice, getLast10Days } from './yahoo.js';

// Quick test
(async () => {
  const company = 'AAPL'; // Apple
  console.log('--- Testing Today Price ---');
  const today = await getTodayPrice(company);
  console.log(today);

  console.log('\n--- Testing Last 10 Days ---');
  const last10 = await getLast10Days(company);
  console.log(last10);
})();
