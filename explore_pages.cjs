const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

const extractedDir = path.join(__dirname, 'extracted_temp');
const pages = [10, 15, 20, 25, 30, 35, 48, 50, 52, 55, 58, 60, 64];

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function checkPage(p) {
  const file = fs.readdirSync(extractedDir).find(f => f.startsWith(`page-${p}-`));
  if (!file) return;
  const filePath = path.join(extractedDir, file);
  const data = fs.readFileSync(filePath);
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: data.toString('base64')
    }
  };

  const textPart = {
    text: "Can you briefly describe what this slide design is portraying? What is the main title or domain? (e.g., Car cockpit, App mockup, Medical dashboard, AI, etc.)"
  };

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [imagePart, textPart]
    });
    console.log(`Page ${p}: ${res.text.trim().substring(0, 120).replace(/\s+/g, ' ')}...`);
  } catch (err) {
    console.log(`Page ${p} error: ${err.message}`);
  }
}

async function run() {
  for (const p of pages) {
    await checkPage(p);
    await delay(12000); // 12 seconds
  }
}

run();
