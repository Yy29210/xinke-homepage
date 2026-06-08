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
const targetModules = [
  '家庭签约服务监管',
  '基本公共卫生资金管理',
  '药品监管平台',
  '预警信息',
  '设备管理驾驶舱',
  '人员监管平台',
  '内控监管平台',
  '耗材监管平台'
];

async function identifyPage(pageFile) {
  const filePath = path.join(extractedDir, pageFile);
  const data = fs.readFileSync(filePath);
  const base64Data = data.toString('base64');

  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: base64Data
    }
  };

  const textPart = {
    text: `You are analyzing a slide from a medical public health supervision software design portfolio.
Look at the image very carefully. It likely contains a slide title or headers.
Is this slide presenting the design design layout mockup / dashboard of one of the following systems?
${targetModules.map(m => `- "${m}"`).join('\n')}

If it is exactly presenting one of these 8, output only the matched title name. Otherwise, output 'none'.
Do not output anything else. No extra text, no markdown.`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [imagePart, textPart]
    });
    
    const ans = response.text.trim();
    return ans;
  } catch (err) {
    return 'error: ' + err.message;
  }
}

async function run() {
  console.log('Starting Gemini analysis of extracted portfolio pages...');
  const files = fs.readdirSync(extractedDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/page-(\d+)/)[1]);
      const numB = parseInt(b.match(/page-(\d+)/)[1]);
      return numA - numB;
    });

  console.log(`Analyzing ${files.length} pages in batches...`);
  
  // To avoid hitting rate limits or timeouts, let's process in batches of 5
  const batchSize = 5;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1}...`);
    
    const results = await Promise.all(batch.map(async (file) => {
      const match = await identifyPage(file);
      return { file, match };
    }));

    results.forEach(r => {
      if (r.match && r.match.toLowerCase() !== 'none' && !r.match.includes('error')) {
        console.log(`MATCH FOUND: File ${r.file} is matched to -> [${r.match}]`);
      }
    });

    // Short pause between batches
    await new Promise(res => setTimeout(res, 1000));
  }
  console.log('Analysis finished.');
}

run().catch(e => console.error(e));
