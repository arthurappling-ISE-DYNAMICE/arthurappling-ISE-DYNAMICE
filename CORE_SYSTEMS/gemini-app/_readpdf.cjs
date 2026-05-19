const pdfParse = require('pdf-parse');
const fs = require('fs');

async function run() {
  const buf = fs.readFileSync('Prime_Pathway_MASTER_MERGED_2026 (2).pdf');
  const fn = pdfParse.default || pdfParse;
  const data = await fn(buf);
  console.log('Pages:', data.numpages);
  console.log('=== TEXT ===');
  console.log(data.text);
}
run().catch(e => console.error('ERROR:', e.message));
