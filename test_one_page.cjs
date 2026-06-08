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

async function checkPage(p) {
  const file = fs.readdirSync(extractedDir).find(f => f.startsWith(`page-${p}-`));
  if (!file) {
    console.log(`Page ${p} file not found`);
    return;
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
    text: `What is written on this B-end software portfolio slide?
Please identify the main title or heading of this slide, and summarize what it is about.`
  };

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [imagePart, textPart]
    });
    console.log(`--- PAGE ${p} (${file}) ---`);
    console.log(res.text);
    console.log('---------------------------');
  } catch (err) {
    console.error(`Page ${p} error:`, err);
  }
}

async function run() {
  // Check pages 40, 41, 42, 43, 44, 45, 46 which are typically the main dashboard pages
  await checkPage(40);
  await checkPage(41);
  await checkPage(42);
  await checkPage(43);
  await checkPage(44);
  await checkPage(45);
}

run();
