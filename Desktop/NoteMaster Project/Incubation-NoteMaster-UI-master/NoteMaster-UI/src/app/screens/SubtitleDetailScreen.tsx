import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, FileText, X, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { Note } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/app/components/ui/Dialog';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';

interface SubtitleDetailScreenProps {
  subtitleId: string;
  onBack: () => void;
}

export function SubtitleDetailScreen({ subtitleId, onBack }: SubtitleDetailScreenProps) {
  const { subtitles, notes, verticals, currentUser, addNote, updateNote, deleteNote } = useApp();
  const subtitle = subtitles.find(s => s.id === subtitleId);
  
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  
  // Form State
  const [newNote, setNewNote] = useState<Partial<Note>>({
    question: '',
    answer: '',
    companyName: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  if (!subtitle) {
    return <div>Subtitle not found</div>;
  }

  const vertical = verticals.find(v => v.id === subtitle.verticalId);
  const isAdmin = currentUser?.role === 'ADMIN';
  
  // 1. Get all relevant notes first
  const allRelevantNotes = notes.filter(n => 
      n.subtitleId === subtitleId && 
      (n.status === 'APPROVED' || n.authorId === currentUser?.id)
  );

  // 2. Extract unique sources for the filter dropdown
  const uniqueSources = Array.from(new Set(allRelevantNotes.map(n => n.companyName).filter(Boolean))).sort();

  // 3. Apply Search and Filters
  const subtitleNotes = allRelevantNotes.filter(note => {
      const matchesSearch = 
        searchTerm === '' || 
        note.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSource = 
        selectedSource === 'all' || 
        note.companyName === selectedSource;

      return matchesSearch && matchesSource;
  });

  const toggleExpand = (id: string) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  const handleOpenModal = (note?: Note) => {
      // If user is not admin and trying to add new note (note is undefined), prevent it
      // Standard users can only edit their own notes (note is defined)
      if (!isAdmin && !note) return;

      if (note) {
          setEditingNote(note);
          setNewNote(note);
      } else {
          setEditingNote(null);
          setNewNote({
            question: '',
            answer: '',
            companyName: '',
            tags: [],
          });
      }
      setIsAddModalOpen(true);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!newNote.tags?.includes(tagInput.trim())) {
        setNewNote({ ...newNote, tags: [...(newNote.tags || []), tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewNote({ ...newNote, tags: newNote.tags?.filter(t => t !== tag) });
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this note?')) {
          deleteNote(id);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.question || !newNote.answer || !newNote.companyName) return;

    // Auto-approve if Admin
    const isAutoApproved = isAdmin;
    const status = isAutoApproved ? 'APPROVED' : 'PENDING';

    if (editingNote) {
        updateNote({
            ...editingNote,
            ...newNote as Note,
            // If user edits, it goes back to PENDING unless they are admin
            status: isAutoApproved ? 'APPROVED' : 'PENDING'
        });
    } else {
        addNote({
            id: Math.random().toString(36).substr(2, 9),
            authorId: currentUser?.id || 'unknown',
            status: status,
            verticalId: vertical?.id || '',
            subtitleId: subtitle.id,
            createdAt: new Date().toISOString(),
            ...newNote as any
        });
    }
    
    setIsAddModalOpen(false);
    // Reset form
    setNewNote({
        question: '',
        answer: '',
        companyName: '',
        tags: [],
    });
    setEditingNote(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <span>{vertical?.name}</span>
                <span>/</span>
                <span>{subtitle.name}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{subtitle.name} Study Guide</h2>
            <p className="text-slate-500">{subtitle.description}</p>
            </div>
        </div>
        
        {isAdmin && (
            <Button onClick={() => handleOpenModal()} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> Add Note
            </Button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors" 
                placeholder="Search questions, answers, tags..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-64">
             <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                   <div className="flex items-center gap-2 text-slate-600">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by Source" />
                   </div>
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">All Sources</SelectItem>
                   {uniqueSources.map(source => (
                       <SelectItem key={source} value={source}>{source}</SelectItem>
                   ))}
                </SelectContent>
             </Select>
          </div>
      </div>

      <div className="grid gap-6">
        {subtitleNotes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No notes found</h3>
            <p className="text-slate-500 mt-1">
                {searchTerm || selectedSource !== 'all' 
                    ? 'Try adjusting your search filters.' 
                    : 'There are no study notes for this topic yet.'}
            </p>
            {isAdmin && !searchTerm && selectedSource === 'all' && (
                <Button variant="link" onClick={() => handleOpenModal()} className="mt-2 text-indigo-600">
                    Be the first to contribute
                </Button>
            )}
            {(searchTerm || selectedSource !== 'all') && (
                <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedSource('all'); }} className="mt-2 text-indigo-600">
                    Clear filters
                </Button>
            )}
          </div>
        ) : (
          subtitleNotes.map((note) => {
            const isAuthor = currentUser?.id === note.authorId;
            // Use isAuthor instead of canModify to strictly enforce "Only they can edit"
            const showActions = isAuthor;

            return (
                <Card 
                key={note.id} 
                className={`transition-all duration-200 border-slate-200 hover:shadow-md cursor-pointer ${expandedNoteId === note.id ? 'ring-2 ring-indigo-500/20' : ''}`}
                onClick={() => toggleExpand(note.id)}
                >
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-900 leading-snug">
                        {note.question}
                        </h4>
                    </div>
                    <div className="flex items-center gap-2">
                         {note.status !== 'APPROVED' && (
                             <Badge variant={note.status === 'PENDING' ? 'secondary' : 'destructive'} className={note.status === 'PENDING' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : ''}>
                                {note.status}
                             </Badge>
                         )}
                         
                         {showActions && expandedNoteId === note.id && (
                             <div className="flex items-center gap-1">
                                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleOpenModal(note); }}>
                                     <Pencil className="h-3 w-3 text-slate-500" />
                                 </Button>
                                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleDeleteNote(e, note.id)}>
                                     <Trash2 className="h-3 w-3 text-red-500" />
                                 </Button>
                             </div>
                         )}
                    </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                    {note.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">#{tag}</span>
                    ))}
                    </div>
                </CardHeader>
                
                <div className={`grid transition-all duration-300 ease-in-out ${expandedNoteId === note.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                    <CardContent className="pt-2 pb-6">
                        <div className="prose prose-slate max-w-none p-4 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                        <p className="text-slate-700 whitespace-pre-wrap">{note.answer}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                            <span>Source: {note.companyName}</span>
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                    </div>
                </div>

                {expandedNoteId !== note.id && (
                    <div className="px-6 pb-4 pt-0 text-center">
                    <ChevronDown className="h-5 w-5 text-slate-300 mx-auto" />
                    </div>
                )}
                </Card>
            );
          })
        )}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Add Study Note'}</DialogTitle>
                <DialogDescription>
                    {editingNote ? 'Modify your' : 'Add a new'} Q&A or insight for <strong>{subtitle.name}</strong>.
                    {isAdmin && <span className="block mt-1 text-green-600 text-xs font-medium">✨ As an Admin, your note will be automatically approved.</span>}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 py-2">
                <div className="space-y-2">
                    <Label htmlFor="company">Company / Source</Label>
                    <Input 
                        id="company" 
                        placeholder="e.g. Interview Question, Documentation, etc." 
                        value={newNote.companyName}
                        onChange={(e) => setNewNote({...newNote, companyName: e.target.value})}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="question">Question / Topic</Label>
                    <Input 
                        id="question" 
                        placeholder="What is the question or topic?" 
                        value={newNote.question}
                        onChange={(e) => setNewNote({...newNote, question: e.target.value})}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="answer">Answer / Explanation</Label>
                    <textarea 
                        id="answer" 
                        className="flex min-h-[150px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                        placeholder="Provide the detailed answer here..."
                        value={newNote.answer}
                        onChange={(e) => setNewNote({...newNote, answer: e.target.value})}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {newNote.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-slate-200" onClick={() => removeTag(tag)}>
                                #{tag} <X className="ml-1 h-3 w-3 text-slate-500" />
                            </Badge>
                        ))}
                    </div>
                    <Input 
                        placeholder="Type tag and hit Enter..." 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                    />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                        {editingNote ? 'Save Changes' : 'Submit Note'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
