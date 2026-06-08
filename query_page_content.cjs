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
const candidates = [40, 41, 42, 43, 44, 45, 60, 61, 62, 63, 64];

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function analyze(p) {
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
    text: "Briefly look at this B-end dashboard design. What is the title written at the top center/left of the page? (Look for terms like '家庭签约服务监管', '基本公共卫生资金管理', '药品监管平台', '预警', '人员监管', '内控监管', '耗材监管', '设备管理驾驶舱'). Please output exactly the system title if found, or describe the main elements of the dashboard title."
  };

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [imagePart, textPart]
    });
    console.log(`Page ${p} (${file}) Match: "${res.text.trim()}"`);
  } catch (err) {
    console.error(`Page ${p} error:`, err.message);
  }
}

async function run() {
  console.log('Analyzing high-res candidates to find specific platforms...');
  for (const p of candidates) {
    await analyze(p);
    console.log('Waiting 15 seconds to stay safe from rate limits...');
    await delay(15000);
  }
}

run();
