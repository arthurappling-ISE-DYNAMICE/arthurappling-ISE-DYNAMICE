import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync } from 'fs';

const data = new Uint8Array(readFileSync('Prime_Pathway_MASTER_MERGED_2026 (2).pdf'));
const doc = await pdfjsLib.getDocument({ data }).promise;
console.log('Total pages:', doc.numPages);

let fullText = '';
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const pageText = content.items.map(item => item.str).join(' ');
  fullText += `\n=== PAGE ${i} ===\n` + pageText;
  if (fullText.length > 20000) break;
}
console.log(fullText.slice(0, 20000));
