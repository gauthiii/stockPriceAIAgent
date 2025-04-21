import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateStockPricePrediction, generateStockPriceRange } from './gemini.js';
import { getTodayPrice, getLast10Days } from './yahoo.js'; // 🔥 NEW IMPORT

dotenv.config();

const app = express();
const port = 3000;

// For ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from frontend/
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the frontend/index.html on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

function cleanJSON(text) {
  return text.replace(/```json|```/g, '').trim();
}

// ========================= GEMINI-BASED APIs =========================


// 🧠 Predict today's price using Gemini
app.post('/predict', async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'companyName is required' });
    }
    const result = await generateStockPricePrediction(companyName);
    const cleanedResult = cleanJSON(result);
    res.json({ company: companyName, todayPrediction: JSON.parse(cleanedResult) });
  } catch (err) {
    console.error('Prediction Error:', err.message);
    res.status(500).json({ error: 'Failed to generate prediction.' });
  }
});

// 📈 Predict last 10 days' prices using Gemini
app.post('/predictRange', async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'companyName is required' });
    }
    const result = await generateStockPriceRange(companyName);
    const cleanedResult = cleanJSON(result);
    res.json({ company: companyName, last10DaysPrediction: JSON.parse(cleanedResult) });
  } catch (err) {
    console.error('Prediction Range Error:', err.message);
    res.status(500).json({ error: 'Failed to generate prediction range.' });
  }
});

// ========================= YAHOO-BASED APIs (REAL DATA) =========================

// 🔥 Predict today's real stock price using Yahoo Finance
app.post('/predict/yahoo', async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'companyName is required' });
    }
    const result = await getTodayPrice(companyName);
    res.json({ company: companyName, todayYahooPrediction: result });
  } catch (err) {
    console.error('Yahoo Today Price Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch today price from Yahoo.' });
  }
});

// 🔥 Predict last 10 days real stock prices using Yahoo Finance
app.post('/predictRange/yahoo', async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'companyName is required' });
    }
    const result = await getLast10Days(companyName);
    res.json({ company: companyName, last10DaysYahooPrediction: result });
  } catch (err) {
    console.error('Yahoo Last 10 Days Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch last 10 days from Yahoo.' });
  }
});

// ========================= Server Listen =========================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
