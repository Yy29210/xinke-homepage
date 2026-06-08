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

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

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
    text: "Review this portfolio slide image. Identify if this page represents a table of contents, index, directory, or introduction chapter headers showing the sequence of pages. If there is text or titles listed, please translate/extract and print any directories other than cover pages."
  };

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [imagePart, textPart]
    });
    console.log(`=== PAGE ${p} ===`);
    console.log(res.text);
    console.log('-----------------');
  } catch (err) {
    console.error(`Page ${p} error:`, err.message);
  }
}

async function run() {
  console.log('Analyzing potential Table of Contents pages...');
  for (let p = 2; p <= 6; p++) {
    await checkPage(p);
    console.log('Waiting 15s to respect API rate limits...');
    await delay(15000);
  }
}

run();
