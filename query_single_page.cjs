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
const pageNum = process.argv[2];

if (!pageNum) {
  console.error('Please specify page number');
  process.exit(1);
}

async function run() {
  const file = fs.readdirSync(extractedDir).find(f => f.startsWith(`page-${pageNum}-`));
  if (!file) {
    console.log(`Page ${pageNum} file not found`);
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
    text: "Can you read the main system title or header of this B-end dashboard? The title is likely very visible, such as '基本公共卫生资金监管平台', '家庭签约服务监管平台', '药品监管平台', '预警信息平台', '医疗耗材监督监测平台' etc. Translate or transcribe the heading exactly (in Chinese)."
  };

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [imagePart, textPart]
    });
    console.log(`PAGE_${pageNum}: ${res.text.trim()}`);
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

run();
