import yahooFinance from 'yahoo-finance2';

// Today Price
export async function getTodayPrice(companyName) {
  try {
    const result = await yahooFinance.quote(companyName);

    console.log("\n\nRESULT\n\n",result);

    return {
      companyName: result.shortName || companyName,
      symbol: result.symbol,
      marketPrice: result.regularMarketPrice,
      currency: result.currency,
      timestamp: new Date(result.regularMarketTime * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Yahoo Finance Error (Today Price):', error.message);
    throw new Error('Failed to fetch today price.');
  }
}

// Last 10 Days Historical
export async function getLast10Days(companyName) {
  try {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 10);

    const queryOptions = { period1: past, period2: today, interval: '1d' };

    const result = await yahooFinance.historical(companyName, queryOptions);

    const last10Days = result.map(day => ({
      date: day.date.toISOString().split('T')[0],
      close: day.close,
    }));

    return { last10Days };
  } catch (error) {
    console.error('Yahoo Finance Error (Last 10 Days):', error.message);
    throw new Error('Failed to fetch last 10 days.');
  }
}
