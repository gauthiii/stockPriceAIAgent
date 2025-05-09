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

    console.log(quote.regularMarketTime)


    return {
      companyName: quote.shortName || symbol,
      symbol: quote.symbol,
      marketPrice: quote.regularMarketPrice,
      currency: quote.currency,
      timestamp: new Date(quote.regularMarketTime).toISOString(),
    };
  } catch (error) {
    console.error('Yahoo Finance Error (Today Price):', error.message);
    throw new Error('Failed to fetch today price.');
  }
}


// Last 10 Days Historical
export async function getLast10Days(companyName) {
  try {
    let symbol = companyName;

    // If companyName is long, auto search
    if (companyName.length > 3) { // rough check
      const searchResult = await yahooFinance.search(companyName);
      symbol = searchResult.quotes[0]?.symbol || companyName;
    }

    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 36500); // 100 years

    const queryOptions = { period1: past, period2: today, interval: '1d' };

    const result = await yahooFinance.historical(symbol, queryOptions);

    // 🧠 Now additionally fetch the company meta (name + currency)
    const quoteResult = await yahooFinance.quote(symbol);

    const last10Days = result.map(day => ({
      date: day.date.toISOString().split('T')[0],
      close: day.close,
    }));

    console.log("\n\n10 days\n\n", last10Days);

    return {
      last10Days,
      companyName: quoteResult.shortName || companyName,
      currency: quoteResult.currency || "USD"
    };
  } catch (error) {
    console.error('Yahoo Finance Error (Last 10 Days):', error.message);
    throw new Error('Failed to fetch last 10 days.');
  }
}
