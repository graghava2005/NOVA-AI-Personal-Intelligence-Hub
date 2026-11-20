import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Plus,
  Pin,
  Trash2,
  Edit3,
  Tag,
  Clock,
  Sparkles,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';

export const KnowledgeVaultPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('Strategy');
  const [formTags, setFormTags] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Distinct categories
  const categories = ['All', 'Strategy', 'Frameworks', 'Research', 'General'];

  // All distinct tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('Strategy');
    setFormTags('');
    setFormIsPinned(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
    setFormTags(note.tags.join(', '));
    setFormIsPinned(!!note.isPinned);
    setIsModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingNote) {
      updateNote(editingNote.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        tags: parsedTags,
        isPinned: formIsPinned,
      });
    } else {
      addNote({
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        tags: parsedTags,
        isPinned: formIsPinned,
      });
    }

    setIsModalOpen(false);
  };

  const handleTogglePin = (note: Note) => {
    updateNote(note.id, { isPinned: !note.isPinned });
  };

  // Filter notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || note.category === selectedCategory;

      const matchesTag =
        !selectedTag || note.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      // Pinned first, then newest
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2942]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Knowledge Vault</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
              Second Brain Repository
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Capture architectures, synthesis notes, and research frameworks. Stored locally with zero cloud telemetry.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90 shadow-glow-purple transition-all"
        >
          <Plus className="w-4 h-4 text-[#22D3EE]" />
          <span>New Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search notes by title, content, or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#151D32] border border-[#1F2942] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6]"
          />
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#64748B] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 font-medium ${
                selectedCategory === cat
                  ? 'bg-[#8B5CF6] text-white shadow-glow-purple font-bold'
                  : 'bg-[#151D32] text-[#94A3B8] hover:text-white border border-[#1F2942]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filter Row */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#8B5CF6]" />
            Tags:
          </span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-semibold hover:bg-rose-500/20 shrink-0 flex items-center gap-1"
            >
              Clear Tag: #{selectedTag}
              <X className="w-3 h-3" />
            </button>
          )}
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-lg text-[11px] shrink-0 transition-colors ${
                selectedTag === tag
                  ? 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40 font-bold'
                  : 'bg-[#101629] text-[#94A3B8] hover:text-white border border-[#1F2942]'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#151D32] border border-dashed border-[#1F2942] p-8">
          <BookOpen className="w-12 h-12 text-[#64748B] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white mb-1">No Notes Match Your Criteria</h3>
          <p className="text-xs text-[#94A3B8] mb-4 max-w-sm mx-auto">
            Try adjusting your search terms or create a new note in your Knowledge Vault.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]"
          >
            Create Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={`p-5 rounded-2xl bg-[#151D32] border transition-all duration-200 flex flex-col justify-between group hover:shadow-xl ${
                note.isPinned
                  ? 'border-[#8B5CF6]/50 shadow-glow-purple/20 bg-gradient-to-br from-[#151D32] to-[#18213a]'
                  : 'border-[#1F2942] hover:border-[#8B5CF6]/30'
              }`}
            >
              <div>
                {/* Note Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {note.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        note.isPinned
                          ? 'text-[#22D3EE] bg-cyan-500/10'
                          : 'text-[#64748B] hover:text-white'
                      }`}
                      title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                      aria-label={note.isPinned ? `Unpin note ${note.title}` : `Pin note ${note.title}`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="p-1.5 text-[#64748B] hover:text-white rounded-lg transition-colors"
                      title="Edit Note"
                      aria-label={`Edit note ${note.title}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 text-[#64748B] hover:text-rose-400 rounded-lg transition-colors"
                      title="Delete Note"
                      aria-label={`Delete note ${note.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-[#22D3EE] transition-colors mb-2">
                  {note.title}
                </h3>

                {/* Content snippet */}
                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-4 whitespace-pre-wrap mb-4">
                  {note.content}
                </p>
              </div>

              {/* Note Footer: Tags & Timestamp */}
              <div className="pt-3 border-t border-[#1F2942] mt-2">
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#101629] text-[#94A3B8] hover:text-white border border-[#1F2942] cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  {note.isPinned && (
                    <span className="text-[#22D3EE] font-semibold flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" />
                      Pinned
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#151D32] border border-[#1F2942] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1F2942]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
                {editingNote ? 'Edit Knowledge Note' : 'Create Knowledge Note'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label htmlFor="vault-note-title" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Note Title
                </label>
                <input
                  id="vault-note-title"
                  type="text"
                  required
                  placeholder="e.g., Latency budget and caching rules"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vault-note-category" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Category
                  </label>
                  <select
                    id="vault-note-category"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Strategy">Strategy</option>
                    <option value="Frameworks">Frameworks</option>
                    <option value="Research">Research</option>
                    <option value="Engineering">Engineering</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="vault-note-tags" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    id="vault-note-tags"
                    type="text"
                    value={formTags}
                    onChange={e => setFormTags(e.target.value)}
                    placeholder="AI, Architecture, Benchmark"
                    className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="vault-note-content" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Note Content
                </label>
                <textarea
                  id="vault-note-content"
                  rows={6}
                  required
                  placeholder="Record your architectural insights, code recipes, or research findings..."
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={formIsPinned}
                  onChange={e => setFormIsPinned(e.target.checked)}
                  className="rounded border-[#1F2942] text-[#8B5CF6] focus:ring-0 bg-[#101629]"
                />
                <label htmlFor="pinCheck" className="text-xs text-[#94A3B8] cursor-pointer">
                  Pin this note to top of Knowledge Vault
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F2942]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90"
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
