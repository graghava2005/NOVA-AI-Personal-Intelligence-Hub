import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  FileCode,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  Clock,
  Hash,
  Search,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractTextFromFile } from '../utils/pdfExtractor';
import { analyzeDocumentText } from '../utils/textIntelligence';
import { DocumentItem } from '../types';

export const DocumentsPage: React.FC = () => {
  const { documents, addDocument, deleteDocument, addNote } = useApp();
  const [selectedDocId, setSelectedDocId] = useState<string>(
    documents[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'summary' | 'points' | 'text' | 'keywords'>('summary');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveNoteSuccess, setSaveNoteSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    // File validation: Size safety check (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB safety threshold. Please select a smaller document.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(`Reading ${file.name}...`);

    try {
      // 1. Extract text via PDF.js or FileReader
      setUploadProgress('Extracting selectable text with PDF.js engine...');
      const extracted = await extractTextFromFile(file);

      // 2. Perform local NLP synthesis
      setUploadProgress('Running local extractive NLP intelligence...');
      const analysis = analyzeDocumentText(extracted.text);

      // 3. Save to AppContext
      addDocument({
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        rawText: extracted.text,
        wordCount: analysis.wordCount,
        readingTimeMin: analysis.readingTimeMin,
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        keywords: analysis.keywords,
        status: 'ready',
      });

      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploading(false);
      setUploadProgress('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to parse document. Please ensure it has selectable text.');
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleCopySummary = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToVault = () => {
    if (!activeDoc) return;
    addNote({
      title: `Summary: ${activeDoc.name}`,
      content: `${activeDoc.summary}\n\n### Key Takeaways:\n${activeDoc.keyPoints.map(p => `- ${p}`).join('\n')}`,
      tags: ['DocumentSummary', ...activeDoc.keywords.slice(0, 3)],
      category: 'Research',
      isPinned: false,
    });
    setSaveNoteSuccess(true);
    setTimeout(() => setSaveNoteSuccess(false), 3000);
  };

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    doc.keywords.some(k => k.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2942]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Smart Document Intelligence</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
              PDF.js Browser Engine
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Extract text from PDF and TXT files. Deterministic extractive summarization executed entirely on your machine.
          </p>
        </div>

        {/* Upload Trigger Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90 shadow-glow-purple transition-all"
          >
            <Upload className="w-4 h-4 text-[#22D3EE]" />
            <span>{isUploading ? 'Analyzing...' : 'Upload PDF / TXT'}</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[#94A3B8] hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading Banner */}
      {isUploading && (
        <div className="p-4 rounded-xl bg-[#151D32] border border-[#8B5CF6]/50 flex items-center gap-3 animate-pulse">
          <div className="w-4 h-4 border-2 border-[#22D3EE] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-white font-medium">{uploadProgress}</span>
        </div>
      )}

      {/* Main Workspace: Document List (Left) + Intelligence Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Repository Library */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#151D32] border border-[#1F2942]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#22D3EE]" />
                Analyzed Documents ({documents.length})
              </h3>
            </div>

            {/* Filter Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Filter by title or tag..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#101629] border border-[#1F2942] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6]"
              />
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2" />
            </div>

            {/* Document Cards */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredDocs.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#94A3B8]">
                  No documents found.
                </div>
              ) : (
                filteredDocs.map(doc => {
                  const isSelected = doc.id === activeDoc?.id;
                  const isPdf = doc.name.toLowerCase().endsWith('.pdf');
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#101629] border-[#8B5CF6] shadow-sm'
                          : 'bg-[#101629]/50 border-[#1F2942] hover:border-[#1F2942]/80 hover:bg-[#101629]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className={`p-2 rounded-lg mt-0.5 ${
                            isPdf
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-cyan-500/10 text-cyan-400'
                          }`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">
                              {doc.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-[#94A3B8]">
                              <span>{(doc.size / 1024).toFixed(0)} KB</span>
                              <span>•</span>
                              <span>{doc.wordCount} words</span>
                            </div>
                          </div>
                        </div>

                        {documents.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDocument(doc.id);
                            }}
                            className="p-1 text-[#64748B] hover:text-rose-400 rounded transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drag & Drop Prompt Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 p-4 rounded-xl border border-dashed border-[#1F2942] hover:border-[#8B5CF6]/60 bg-[#101629]/40 cursor-pointer text-center group transition-colors"
            >
              <Upload className="w-5 h-5 text-[#64748B] group-hover:text-[#22D3EE] mx-auto mb-1 transition-colors" />
              <p className="text-xs font-medium text-white">Click or Drop PDF / TXT</p>
              <p className="text-[10px] text-[#64748B] mt-0.5">Tested with papers, notes & manuals</p>
            </div>
          </div>
        </div>

        {/* Right Column: Intelligence Analysis View */}
        <div className="lg:col-span-8">
          {activeDoc ? (
            <div className="rounded-2xl bg-[#151D32] border border-[#1F2942] overflow-hidden shadow-xl">
              {/* Active Document Top Details */}
              <div className="p-6 bg-[#101629] border-b border-[#1F2942] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {activeDoc.name.split('.').pop()?.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-white truncate max-w-md">
                      {activeDoc.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-[#22D3EE]" />
                      {activeDoc.wordCount} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      {activeDoc.readingTimeMin} min read
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      100% Parsed
                    </span>
                  </div>
                </div>

                {/* Quick actions for current doc */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#151D32] hover:bg-[#1B243E] border border-[#1F2942] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleSaveToVault}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90 shadow-glow-purple transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>{saveNoteSuccess ? 'Saved to Vault!' : 'Save to Vault'}</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div
                role="tablist"
                aria-label="Document intelligence sections"
                className="px-6 border-b border-[#1F2942] flex items-center gap-6 text-xs font-medium overflow-x-auto"
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'summary'}
                  onClick={() => setActiveTab('summary')}
                  className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] ${
                    activeTab === 'summary'
                      ? 'border-[#8B5CF6] text-white font-bold'
                      : 'border-transparent text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Executive Summary
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'points'}
                  onClick={() => setActiveTab('points')}
                  className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-1 focus:ring-[#22D3EE] ${
                    activeTab === 'points'
                      ? 'border-[#22D3EE] text-white font-bold'
                      : 'border-transparent text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-[#22D3EE]" />
                  Key Takeaways ({activeDoc.keyPoints.length})
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'text'}
                  onClick={() => setActiveTab('text')}
                  className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-1 focus:ring-indigo-400 ${
                    activeTab === 'text'
                      ? 'border-indigo-400 text-white font-bold'
                      : 'border-transparent text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Extracted Raw Text
                </button>

                <button
                  role="tab"
                  aria-selected={activeTab === 'keywords'}
                  onClick={() => setActiveTab('keywords')}
                  className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-1 focus:ring-emerald-400 ${
                    activeTab === 'keywords'
                      ? 'border-emerald-400 text-white font-bold'
                      : 'border-transparent text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  Keywords & Topics
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-6">
                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-[#101629] border border-[#1F2942]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Synthesized Executive Brief
                      </h4>
                      <p className="text-sm text-white leading-relaxed font-sans">
                        {activeDoc.summary}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-[#94A3B8]">
                      <p className="font-semibold text-purple-300 mb-1">
                        How NOVA Local Summarization Works:
                      </p>
                      <p>
                        This summary was produced using local frequency-weighted sentence ranking, position weighting, and signal phrase scoring directly inside your browser. No remote API requests or LLM tokens were consumed.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'points' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                      Core Actionable Points
                    </h4>
                    {activeDoc.keyPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#101629] border border-[#1F2942] flex items-start gap-3 hover:border-[#22D3EE]/40 transition-colors"
                      >
                        <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-[#22D3EE] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-white leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'text' && (
                  <div>
                    <div className="flex items-center justify-between mb-2 text-xs text-[#94A3B8]">
                      <span>Extracted Character Stream</span>
                      <span>{activeDoc.rawText.length} characters</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#101629] border border-[#1F2942] max-h-96 overflow-y-auto font-mono text-xs text-[#94A3B8] leading-relaxed whitespace-pre-wrap selection:bg-purple-500 selection:text-white">
                      {activeDoc.rawText}
                    </div>
                  </div>
                )}

                {activeTab === 'keywords' && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
                      High-Relevance Entity & Keyword Clusters
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {activeDoc.keywords.map((kw, idx) => (
                        <div
                          key={idx}
                          className="px-3.5 py-1.5 rounded-xl bg-[#101629] border border-[#1F2942] text-xs font-medium text-white flex items-center gap-1.5 shadow-sm"
                        >
                          <Hash className="w-3.5 h-3.5 text-[#22D3EE]" />
                          <span>{kw}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-[#151D32] border border-dashed border-[#1F2942] text-center">
              <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Document Selected</h3>
              <p className="text-xs text-[#94A3B8] mb-4">
                Select an analyzed document from the left library or upload a new PDF / TXT file.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#8B5CF6]"
              >
                Upload Document Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
