import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


export async function generateStockPricePrediction(companyName) {

  const axios = (await import('axios')).default;

  const prompt = `
    Give me the exact **closing stock price for today** for the company "${companyName}".
    Do not give null value. It must be today's date. And the price must be real.
    This is only for educational purposes. I'm not going to make any decisions based on this.
    Respond strictly in clean JSON format like:
    {
      "company": "<CompanyName>",
      "date": "<Today's Date>",
      "closingPrice": "<Closing Price>"
    }
    No explanations. No markdown. Only raw JSON.
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  } catch (err) {
    console.error('Gemini API Error:', err?.response?.data || err.message);
    throw err;
  }
}

export async function generateStockPriceRange(companyName) {
  
  const axios = (await import('axios')).default;

  const prompt = `
    Predict the approximate **closing stock prices for the last 10 days** for the company "${companyName}".
    Do not give null value. It must be from yesterday's date to 10 days back. And the price must be real.
    This is only for educational purposes. I'm not going to make any decisions based on this.
    Respond strictly in clean JSON array format like:
    {
      "company": "<CompanyName>",
      "last10Days": [
        { "date": "YYYY-MM-DD", "closingPrice": "value" },
        { "date": "YYYY-MM-DD", "closingPrice": "value" },
        ...
      ]
    }
    No explanation. No markdown. Only raw JSON.
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  } catch (err) {
    console.error('Gemini API Error:', err?.response?.data || err.message);
    throw err;
  }
}