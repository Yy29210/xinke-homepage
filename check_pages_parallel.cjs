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
const pagesToCheck = [52, 53, 54, 55, 56];

async function checkPage(p) {
  const file = fs.readdirSync(extractedDir).find(f => f.startsWith(`page-${p}-`));
  if (!file) {
    return `Page ${p} file not found`;
  }
  const filePath = path.join(extractedDir, file);
  const data = fs.readFileSync(filePath);
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: data.toString('base64')
    }
  };

  const textPart = {
    text: "Describe the Chinese title or header of this slide in brief. Mention if it represents a medical, healthcare, or government supervision system."
  };

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [imagePart, textPart]
    });
    return `Page ${p}: ${res.text.trim()}`;
  } catch (err) {
    return `Page ${p} error: ${err.message}`;
  }
}

async function run() {
  console.log('Checking pages in parallel:', pagesToCheck);
  const results = await Promise.all(pagesToCheck.map(checkPage));
  results.forEach(r => console.log(r));
}

run();
