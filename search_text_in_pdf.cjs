const { getDocument } = require('pdfjs-dist');
const path = require('path');

const pdfPath = path.join(__dirname, 'public', 'portfolio.pdf');

async function run() {
  console.log('Searching text in PDF...');
  const doc = await getDocument(pdfPath).promise;
  const pageCount = doc._pdfInfo.numPages;

  const targets = [
    { label: '家庭签约服务监管', keywords: ['家庭签约', '家签', '家庭医生'] },
    { label: '基本公共卫生资金管理', keywords: ['公共卫生', '公卫', '卫计', '卫生资金'] },
    { label: '药品监管平台', keywords: ['药品', '合理用药', '用药监管', '抗菌药物'] },
    { label: '预警信息', keywords: ['预警', '预警信息', '告警', '警告'] },
    { label: '设备管理驾驶舱', keywords: ['设备管理', '设备管理驾驶舱'] },
    { label: '人员监管平台', keywords: ['人员监管', '执业'] },
    { label: '内控监管平台', keywords: ['内控', '收支'] },
    { label: '耗材监管平台', keywords: ['耗材'] }
  ];

  for (let p = 1; p <= pageCount; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    
    targets.forEach(t => {
      const matched = t.keywords.some(kw => pageText.includes(kw));
      if (matched) {
        console.log(`Page ${p} matches [${t.label}]: "${pageText.substring(0, 100).replace(/\s+/g, ' ')}... "`);
      }
    });
  }
}

run().catch(e => console.error(e));
