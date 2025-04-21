import yahooFinance from 'yahoo-finance2';


export async function searchSymbolFromName(companyName) {
  try {
    const result = await yahooFinance.search(companyName);
    return result.quotes[0]?.symbol || null;
  } catch (error) {
    console.error('Yahoo Search Error:', error.message);
    throw new Error('Failed to search company symbol.');
  }
}


// Today Price
export async function getTodayPrice(companyName) {
  try {
    let symbol = companyName;

    // If companyName is long, auto search
    if (companyName.length > 3) { // rough check
      const result = await yahooFinance.search(companyName);
      symbol = result.quotes[0]?.symbol || companyName;
    }

    const quote = await yahooFinance.quote(symbol);

    return {
      companyName: quote.shortName || symbol,
      symbol: quote.symbol,
      marketPrice: quote.regularMarketPrice,
      currency: quote.currency,
      timestamp: new Date(quote.regularMarketTime * 1000).toISOString(),
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
