import { PDFParse } from 'pdf-parse';
import { readFileSync } from 'fs';

const buf = readFileSync('Prime_Pathway_MASTER_MERGED_2026 (2).pdf');
const parser = new PDFParse({});
const data = await parser.parse(buf);
console.log('Pages:', data.numpages);
console.log(data.text.slice(0, 15000));
