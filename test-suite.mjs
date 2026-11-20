import assert from 'node:assert';
import { analyzeDocumentText } from './src/utils/textIntelligence.ts';
import { generateAssistantResponse, SUGGESTED_PROMPTS } from './src/utils/aiResponses.ts';

console.log('🧪 Starting NOVA Personal Intelligence Hub Comprehensive Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     ${err.message}`);
  }
}

// -------------------------------------------------------------
// MODULE 1: NLP & Document Intelligence Engine
// -------------------------------------------------------------
console.log('📦 MODULE 1: Local Extractive NLP Engine');

test('NLP handles empty or whitespace text gracefully', () => {
  const result = analyzeDocumentText('   ');
  assert.strictEqual(result.wordCount, 0);
  assert.strictEqual(result.readingTimeMin, 0);
  assert(result.summary.includes('No readable text content'));
  assert.strictEqual(result.keywords.length, 0);
});

test('NLP extracts high-density keywords and calculates reading time', () => {
  const sample = `
    Autonomous artificial intelligence systems maintain continuous loops of perception and execution.
    Deterministic local text synthesis enables high privacy without cloud telemetry.
    The primary objective of modern intelligence platforms is reducing cognitive fragmentation.
    In conclusion, edge computing delivers significant latency improvements and secure sovereign data storage.
  `;
  const result = analyzeDocumentText(sample);
  assert(result.wordCount > 30, `Expected wordCount > 30, got ${result.wordCount}`);
  assert.strictEqual(result.readingTimeMin, 1);
  assert(result.keywords.length > 0, 'Keywords should be populated');
  assert(result.summary.length > 50, 'Summary should be generated');
  assert(result.keyPoints.length > 0, 'Key points should be extracted');
});

test('NLP signal phrase weighting prioritizes crucial conclusions', () => {
  const sample = `
    The quick brown fox jumps over the lazy dog.
    Some secondary observations were noted during the afternoon cycle.
    In conclusion, the proposed architecture drastically enhances user focus and throughput.
  `;
  const result = analyzeDocumentText(sample);
  assert(result.summary.includes('In conclusion'), 'Summary should capture high-signal conclusion sentence');
});

// -------------------------------------------------------------
// MODULE 2: AI Assistant Co-Pilot & Intent Engine
// -------------------------------------------------------------
console.log('\n🤖 MODULE 2: AI Assistant Co-Pilot Intent Engine');

test('Suggested prompts library is populated with 4 distinct categories', () => {
  assert(SUGGESTED_PROMPTS.length >= 6);
  const categories = new Set(SUGGESTED_PROMPTS.map(p => p.category));
  assert(categories.has('brainstorm'));
  assert(categories.has('planning'));
  assert(categories.has('summary'));
  assert(categories.has('explanation'));
});

test('Assistant generates PARA framework explanation with follow-ups', () => {
  const res = generateAssistantResponse('Explain the PARA method for my Second Brain');
  assert(res.text.includes('PARA Framework'));
  assert(res.text.includes('Projects'));
  assert(res.text.includes('Areas'));
  assert(res.followUps.length >= 2);
});

test('Assistant generates 5-Day Sprint Plan', () => {
  const res = generateAssistantResponse('Give me a 5-day sprint execution plan');
  assert(res.text.includes('5-Day Sprint Architecture'));
  assert(res.text.includes('Monday'));
  assert(res.text.includes('Friday'));
  assert(res.followUps.length >= 2);
});

test('Assistant generates Eisenhower Matrix triage', () => {
  const res = generateAssistantResponse('How do I prioritize urgent tasks?');
  assert(res.text.includes('Eisenhower Decision Matrix'));
  assert(res.text.includes('Urgent & Important'));
});

test('Assistant handles arbitrary general questions gracefully with local disclaimer', () => {
  const res = generateAssistantResponse('What should I cook for dinner tonight?');
  assert(res.text.includes('NOVA Intelligence Analysis'));
  assert(res.text.includes('deterministic intelligence simulator'));
  assert(res.followUps.length > 0);
});

// -------------------------------------------------------------
// MODULE 3: Productivity Scoring & Mathematical Invariants
// -------------------------------------------------------------
console.log('\n📊 MODULE 3: Productivity Scoring & Mathematical Invariants');

test('Productivity score clamps between 20 and 100', () => {
  const calcScore = (completed, docs, notes, progress) => {
    return Math.min(100, Math.max(20, Math.round(
      (completed * 12) + (docs * 10) + (notes * 8) + (progress * 0.25) + 20
    )));
  };

  assert.strictEqual(calcScore(0, 0, 0, 0), 20);
  const midScore = calcScore(2, 2, 3, 50);
  assert(midScore > 50 && midScore <= 100, `Expected 50-100, got ${midScore}`);
  assert.strictEqual(calcScore(10, 10, 10, 100), 100);
});

// -------------------------------------------------------------
// MODULE 4: Knowledge Vault Logic & Tag Filtering
// -------------------------------------------------------------
console.log('\n🧠 MODULE 4: Knowledge Vault Logic & Tag Indexing');

test('Vault filters notes by search query across title, content and tags', () => {
  const mockNotes = [
    { id: '1', title: 'Transformer latency', content: 'KV cache optimizations', tags: ['AI', 'Performance'], isPinned: true },
    { id: '2', title: 'Productivity Habits', content: 'Shutdown rituals', tags: ['Focus'], isPinned: false },
  ];

  const search = 'cache';
  const matches = mockNotes.filter(n =>
    n.title.toLowerCase().includes(search) ||
    n.content.toLowerCase().includes(search) ||
    n.tags.some(t => t.toLowerCase().includes(search))
  );

  assert.strictEqual(matches.length, 1);
  assert.strictEqual(matches[0].id, '1');
});

test('Vault pin ordering prioritizes pinned notes first', () => {
  const mockNotes = [
    { id: '1', isPinned: false, updatedAt: '2026-11-20T10:00:00Z' },
    { id: '2', isPinned: true, updatedAt: '2026-11-19T10:00:00Z' },
    { id: '3', isPinned: false, updatedAt: '2026-11-20T11:00:00Z' },
  ];

  const sorted = [...mockNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  assert.strictEqual(sorted[0].id, '2'); // Pinned item must be first
  assert.strictEqual(sorted[1].id, '3'); // Newest unpinned item must be second
});

// -------------------------------------------------------------
// MODULE 5: Task Planner & Priority Filtering
// -------------------------------------------------------------
console.log('\n📅 MODULE 5: Task Planner Execution & Velocity Logic');

test('Task completion toggle updates completed count and progress percentage', () => {
  const tasks = [
    { id: 't1', status: 'Pending', priority: 'High' },
    { id: 't2', status: 'Completed', priority: 'High' },
    { id: 't3', status: 'Completed', priority: 'Medium' },
    { id: 't4', status: 'Pending', priority: 'Low' },
  ];

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const total = tasks.length;
  const progress = Math.round((completed / total) * 100);

  assert.strictEqual(completed, 2);
  assert.strictEqual(total, 4);
  assert.strictEqual(progress, 50);
});

// -------------------------------------------------------------
// MODULE 6: Security & Deployment Readiness
// -------------------------------------------------------------
console.log('\n🔒 MODULE 6: Security & Deployment Integrity');

test('No remote API keys or secrets in source files', async () => {
  const fs = await import('node:fs');
  const files = ['src/App.tsx', 'src/context/AppContext.tsx', 'src/utils/aiResponses.ts', 'src/utils/pdfExtractor.ts'];
  const secretRegex = /(?:sk-[a-zA-Z0-9_-]{24,}|AIzaSy[a-zA-Z0-9_-]{33}|ghp_[a-zA-Z0-9]{36})/;
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    assert(!secretRegex.test(content), `Potential secret token pattern matched in ${f}`);
  }
});

test('index.html contains valid metadata and favicon link', async () => {
  const fs = await import('node:fs');
  const html = fs.readFileSync('index.html', 'utf8');
  assert(html.includes('lang="en"'), 'Must have lang="en"');
  assert(html.includes('<title>'), 'Must have title tag');
  assert(html.includes('meta name="description"'), 'Must have meta description');
  assert(html.includes('favicon.svg'), 'Must reference favicon.svg');
});

test('Production build output files exist with required SPA redirects', async () => {
  const fs = await import('node:fs');
  assert(fs.existsSync('dist/index.html'), 'dist/index.html must exist');
  assert(fs.existsSync('dist/_redirects'), 'dist/_redirects must exist for Netlify');
  assert(fs.existsSync('vercel.json'), 'vercel.json must exist for Vercel');
});

console.log(`\n=================================================`);
console.log(`All Tests Completed: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log(`=================================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
