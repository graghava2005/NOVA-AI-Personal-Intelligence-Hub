import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Cpu,
  Layers,
  ArrowRight,
  Plus,
  RefreshCw,
  Lightbulb,
  FileCheck2,
  CalendarCheck2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUGGESTED_PROMPTS, generateAssistantResponse } from '../utils/aiResponses';

export const AssistantPage: React.FC = () => {
  const { chatMessages, addChatMessage, clearChat, addTask, addNote } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    // 1. Append user message
    addChatMessage({
      sender: 'user',
      text: text.trim(),
    });

    if (!textToSend) {
      setInputValue('');
    }

    // 2. Simulate intelligent local processing
    setIsTyping(true);

    const typingDuration = Math.min(1200, Math.max(500, text.length * 15));

    setTimeout(() => {
      const response = generateAssistantResponse(text);
      addChatMessage({
        sender: 'nova',
        text: response.text,
        suggestedFollowUps: response.followUps,
      });
      setIsTyping(false);
    }, typingDuration);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAsTask = (text: string) => {
    const firstLine = text.split('\n')[0].replace(/^[#*-\s]+/, '') || 'AI Suggested Objective';
    addTask({
      title: firstLine.slice(0, 70),
      description: text.slice(0, 200),
      priority: 'Medium',
      status: 'Pending',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      category: 'AI Synthesis',
    });
    setActionFeedback('Saved directly to Task Planner!');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleSaveAsNote = (text: string) => {
    const lines = text.split('\n');
    const title = lines[0].replace(/^[#*-\s]+/, '') || 'AI Intelligence Note';
    addNote({
      title: title.slice(0, 60),
      content: text,
      tags: ['NOVA-AI', 'Synthesis'],
      category: 'Research',
      isPinned: false,
    });
    setActionFeedback('Saved directly to Knowledge Vault!');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const filteredPrompts = activeCategoryFilter === 'all'
    ? SUGGESTED_PROMPTS
    : SUGGESTED_PROMPTS.filter(p => p.category === activeCategoryFilter);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[850px] bg-[#151D32] border border-[#1F2942] rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Top Header Bar */}
      <div className="px-6 py-4 bg-[#101629] border-b border-[#1F2942] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#6D28D9] to-[#22D3EE] flex items-center justify-center text-white shadow-glow-purple">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22D3EE] ring-2 ring-[#101629] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">NOVA Assistant Co-Pilot</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                Deterministic Simulator
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Client-side NLP intelligence • Zero remote latency • Complete privacy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actionFeedback && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg animate-in fade-in">
              {actionFeedback}
            </span>
          )}
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#94A3B8] hover:text-white bg-[#151D32] hover:bg-[#1B243E] border border-[#1F2942] transition-colors"
            title="Reset Chat Session"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Filter Pills */}
      <div className="px-6 py-2.5 bg-[#0e1426] border-b border-[#1F2942] flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[#64748B] text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
          Suggestions:
        </span>
        {['all', 'brainstorm', 'planning', 'summary', 'explanation'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-2.5 py-1 rounded-lg capitalize transition-colors shrink-0 text-xs ${
              activeCategoryFilter === cat
                ? 'bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/50 font-bold'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#151D32]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {chatMessages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md rounded-tr-none'
                      : 'bg-[#101629] text-[#F8FAFC] border border-[#1F2942] shadow-sm rounded-tl-none'
                  }`}
                >
                  {/* Formatted body */}
                  <div className="whitespace-pre-wrap font-sans space-y-2">
                    {msg.text.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={idx} className="text-sm sm:text-base font-bold text-[#22D3EE] mt-2 mb-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('> ')) {
                        return (
                          <blockquote key={idx} className="border-l-2 border-[#8B5CF6] pl-3 py-1 my-2 text-[#94A3B8] italic bg-[#151D32]/50 rounded-r">
                            {paragraph.replace('> ', '')}
                          </blockquote>
                        );
                      }
                      return <p key={idx}>{paragraph}</p>;
                    })}
                  </div>

                  {/* Actions Bar for NOVA responses */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-[#1F2942] flex items-center justify-between text-[11px] text-[#94A3B8]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveAsTask(msg.text)}
                          className="flex items-center gap-1 hover:text-[#22D3EE] transition-colors ml-2"
                          title="Add as task"
                        >
                          <CalendarCheck2 className="w-3 h-3" />
                          <span>To Task</span>
                        </button>

                        <button
                          onClick={() => handleSaveAsNote(msg.text)}
                          className="flex items-center gap-1 hover:text-[#8B5CF6] transition-colors ml-2"
                          title="Save as note"
                        >
                          <FileCheck2 className="w-3 h-3" />
                          <span>To Note</span>
                        </button>
                      </div>

                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {isUser && (
                    <div className="text-right text-[10px] text-purple-200/80 mt-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {/* Follow up suggestions */}
                {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.suggestedFollowUps.map((fu, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSendMessage(fu)}
                        className="px-3 py-1 rounded-full text-[11px] bg-[#101629] text-[#94A3B8] hover:text-[#22D3EE] border border-[#1F2942] hover:border-[#22D3EE]/40 transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#22D3EE]" />
                        <span>{fu}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Animation State */}
        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#101629] border border-[#1F2942] rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-[#94A3B8] ml-2 font-mono">Synthesizing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Grid */}
      <div className="px-6 py-2 bg-[#101629]/90 border-t border-[#1F2942]">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filteredPrompts.slice(0, 4).map(item => (
            <button
              key={item.id}
              onClick={() => handleSendMessage(item.prompt)}
              className="px-3 py-1.5 rounded-xl bg-[#151D32] border border-[#1F2942] hover:border-[#8B5CF6]/50 text-left shrink-0 text-xs text-[#F8FAFC] hover:text-[#22D3EE] transition-all flex items-center gap-1.5 group"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#22D3EE] transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-5 bg-[#101629] border-t border-[#1F2942]">
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Message prompt for NOVA Assistant"
            placeholder="Ask NOVA to plan a sprint, summarize notes, or prioritize tasks... (Enter to send, Shift+Enter for newline)"
            className="w-full pl-4 pr-24 py-3 rounded-xl bg-[#151D32] border border-[#1F2942] text-xs sm:text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6] resize-none transition-colors"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className={`p-2.5 rounded-xl transition-all ${
                inputValue.trim() && !isTyping
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-glow-purple'
                  : 'bg-[#1F2942] text-[#64748B] cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] text-[#64748B]">
          <span>Shift + Enter for new line • Local deterministic NLP simulation</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Zero external API calls
          </span>
        </div>
      </div>
    </div>
  );
};
