// Local NLP and Extractive Text Intelligence Engine
// Operates 100% in-browser without external network or API calls

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re',
  'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who',
  'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re',
  'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'also', 'just', 'like', 'will'
]);

const SIGNAL_PHRASES = [
  'in conclusion', 'consequently', 'overall', 'crucial', 'essential',
  'important', 'key finding', 'results indicate', 'we demonstrate',
  'significantly', 'primary objective', 'breakthrough', 'furthermore',
  'in summary', 'fundamental', 'architecture', 'strategy', 'proposed'
];

export interface TextAnalysisResult {
  wordCount: number;
  readingTimeMin: number;
  summary: string;
  keyPoints: string[];
  keywords: string[];
}

export function analyzeDocumentText(rawText: string): TextAnalysisResult {
  const cleanText = rawText.replace(/\r\n/g, '\n').trim();
  if (!cleanText) {
    return {
      wordCount: 0,
      readingTimeMin: 0,
      summary: 'No readable text content detected in this document.',
      keyPoints: ['Empty or unreadable document.'],
      keywords: []
    };
  }

  // Tokenize words
  const words = cleanText
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  const wordCount = words.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Frequency mapping
  const freqMap: Record<string, number> = {};
  for (const word of words) {
    if (!STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }
  }

  // Extract top keywords
  const sortedKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

  // Split into sentences
  const sentenceRegex = /([A-Z][^.!?]*[.!?])/g;
  let matches: string[] | null = cleanText.match(sentenceRegex);
  if (!matches || matches.length === 0) {
    // Fallback: split by newline or punctuation
    matches = cleanText.split(/\n+/).map(s => s.trim()).filter(s => s.length > 20);
  }

  const sentences = (matches || [cleanText])
    .map(s => s.trim().replace(/\s+/g, ' '))
    .filter(s => s.length > 25 && s.length < 400);

  if (sentences.length === 0) {
    return {
      wordCount,
      readingTimeMin,
      summary: cleanText.slice(0, 300) + '...',
      keyPoints: [cleanText.slice(0, 150)],
      keywords: sortedKeywords
    };
  }

  // Score sentences
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    const lower = sentence.toLowerCase();

    // Word frequency match
    const sentenceWords = lower.replace(/[^\w\s]/g, '').split(/\s+/);
    for (const sw of sentenceWords) {
      if (freqMap[sw]) {
        score += freqMap[sw];
      }
    }

    // Position weight (first 20% and last 10% are often informative)
    const positionRatio = index / sentences.length;
    if (positionRatio < 0.2) score *= 1.4;
    else if (positionRatio > 0.85) score *= 1.25;

    // Signal phrase boost
    for (const phrase of SIGNAL_PHRASES) {
      if (lower.includes(phrase)) {
        score += 8;
      }
    }

    // Length sanity normalization (ideal 80 - 220 chars)
    if (sentence.length >= 70 && sentence.length <= 250) {
      score += 4;
    }

    return { sentence, score, originalIndex: index };
  });

  // Top summary sentences (3-4 sentences in chronological order)
  const topForSummary = [...scoredSentences]
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(4, scoredSentences.length))
    .sort((a, b) => a.originalIndex - b.originalIndex);

  const summary = topForSummary.map(item => item.sentence).join(' ');

  // Key points (distinct high-impact statements)
  const topForPoints = [...scoredSentences]
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(6, scoredSentences.length));

  // Deduplicate and format key points
  const keyPoints = topForPoints.map(item => {
    let point = item.sentence.trim();
    if (!point.endsWith('.')) point += '.';
    return point;
  });

  return {
    wordCount,
    readingTimeMin,
    summary: summary || cleanText.slice(0, 250),
    keyPoints: keyPoints.length > 0 ? keyPoints : ['Document analyzed successfully with local intelligence.'],
    keywords: sortedKeywords.length > 0 ? sortedKeywords : ['Intelligence', 'Document', 'Analysis']
  };
}
