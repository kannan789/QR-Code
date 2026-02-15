import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/app/components/ui/Dialog';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/Tabs';
import { Plus, Search, Building2, Tag as TagIcon, ChevronRight } from 'lucide-react';
import { Note } from '@/app/lib/types';
import { formatDate } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function UserHomeScreen() {
  const { currentUser, verticals, subtitles, notes, addNote, deleteNote } = useApp();
  const [activeVerticalId, setActiveVerticalId] = useState<string>(
    currentUser?.assignedVerticals[0] || (verticals[0]?.id)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewNote, setViewNote] = useState<Note | null>(null);

  // Form State
  const [newNote, setNewNote] = useState<Partial<Note>>({
    verticalId: activeVerticalId,
    subtitleId: '',
    question: '',
    answer: '',
    companyName: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const assignedVerticals = verticals.filter(v => 
    currentUser?.role === 'ADMIN' || currentUser?.assignedVerticals.includes(v.id)
  );

  const activeVertical = verticals.find(v => v.id === activeVerticalId);
  const activeSubtitles = subtitles.filter(s => s.verticalId === activeVerticalId);

  // Filter notes for the view
  const displayNotes = notes.filter(n => {
      const matchVertical = n.verticalId === activeVerticalId;
      const matchSearch = n.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      // Users see their own pending/rejected notes, but only APPROVED notes from others
      const matchAuth = (n.status === 'APPROVED') || (n.authorId === currentUser?.id);
      
      return matchVertical && matchSearch && matchAuth;
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.question || !newNote.answer || !newNote.companyName || !newNote.subtitleId) return;

    addNote({
        id: Math.random().toString(36).substr(2, 9),
        authorId: currentUser?.id || 'unknown',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        ...newNote as any
    });
    setIsAddModalOpen(false);
    setNewNote({
        verticalId: activeVerticalId,
        subtitleId: '',
        question: '',
        answer: '',
        companyName: '',
        tags: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Knowledge Base</h1>
           <p className="text-slate-500">Explore insights and contribute new findings.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Contribute Note
        </Button>
      </div>

      {/* Vertical Tabs (if multiple) */}
      {assignedVerticals.length > 0 && (
          <div className="border-b border-slate-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                  {assignedVerticals.map((vertical) => (
                      <button
                          key={vertical.id}
                          onClick={() => setActiveVerticalId(vertical.id)}
                          className={`
                              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                              ${activeVerticalId === vertical.id
                                  ? 'border-indigo-500 text-indigo-600'
                                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}
                          `}
                      >
                          {vertical.name}
                      </button>
                  ))}
              </nav>
          </div>
      )}

      {/* Subtitle Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
                className="pl-9 bg-white" 
                placeholder="Search questions, companies, tags..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Could add subtitle tabs here if needed, but search is often better */}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AnimatePresence>
            {displayNotes.map((note) => (
                <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card 
                        className="h-full cursor-pointer hover:shadow-md transition-all hover:border-indigo-200 group"
                        onClick={() => setViewNote(note)}
                    >
                        <CardContent className="p-6 flex flex-col h-full space-y-4">
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                    {subtitles.find(s => s.id === note.subtitleId)?.name}
                                </Badge>
                                {note.authorId === currentUser?.id && (
                                    <Badge variant={note.status === 'APPROVED' ? 'success' : note.status === 'REJECTED' ? 'destructive' : 'warning'} className="text-[10px] px-1.5 h-5">
                                        {note.status}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                <h3 className="font-semibold text-lg text-slate-900 leading-snug line-clamp-3 group-hover:text-indigo-600 transition-colors">
                                    {note.question}
                                </h3>
                                <div className="flex items-center text-sm text-slate-500 font-medium">
                                    <Building2 className="mr-2 h-4 w-4 text-slate-400" />
                                    {note.companyName}
                                </div>
                            </div>

                            <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>{formatDate(note.createdAt)}</span>
                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
         </AnimatePresence>
         
         {displayNotes.length === 0 && (
             <div className="col-span-full py-16 text-center text-slate-400">
                 <p className="text-lg font-medium">No notes found.</p>
                 <p className="text-sm">Try adjusting your search or add a new note.</p>
             </div>
         )}
      </div>

      {/* Add Note Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Contribute Knowledge</DialogTitle>
                <DialogDescription>Share insights for the {activeVertical?.name} vertical.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 py-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Vertical</Label>
                        <div className="px-3 py-2 text-sm font-medium bg-slate-100 rounded-md text-slate-700">
                            {activeVertical?.name}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Category (Subtitle)</Label>
                        <Select 
                            value={newNote.subtitleId} 
                            onValueChange={(val) => setNewNote({...newNote, subtitleId: val})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {activeSubtitles.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                        id="company" 
                        placeholder="e.g. Acme Corp" 
                        value={newNote.companyName}
                        onChange={(e) => setNewNote({...newNote, companyName: e.target.value})}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="question">Question / Topic</Label>
                    <Input 
                        id="question" 
                        placeholder="What is the key insight?" 
                        value={newNote.question}
                        onChange={(e) => setNewNote({...newNote, question: e.target.value})}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="answer">Answer / Details</Label>
                    <textarea 
                        id="answer" 
                        className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                        placeholder="Provide detailed answer..."
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
                                #{tag} <span className="ml-1 text-slate-400">×</span>
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
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Submit Note</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* View Note Modal */}
      <Dialog open={!!viewNote} onOpenChange={(open) => !open && setViewNote(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
             {viewNote && (
                 <>
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                             <Badge variant="outline">{subtitles.find(s => s.id === viewNote.subtitleId)?.name}</Badge>
                             {viewNote.status !== 'APPROVED' && (
                                 <Badge variant={viewNote.status === 'REJECTED' ? 'destructive' : 'warning'}>
                                     {viewNote.status}
                                 </Badge>
                             )}
                        </div>
                        <DialogTitle className="text-xl leading-relaxed">{viewNote.question}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 pt-2">
                            <Building2 className="h-4 w-4" />
                            {viewNote.companyName}
                            <span className="mx-1">•</span>
                            {formatDate(viewNote.createdAt)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-6">
                        <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {viewNote.answer}
                        </div>
                        
                        {viewNote.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                                <TagIcon className="h-4 w-4 text-slate-400" />
                                {viewNote.tags.map(tag => (
                                    <span key={tag} className="text-sm text-slate-500">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                         {viewNote.authorId === currentUser?.id && (
                             <Button variant="destructive" onClick={() => { deleteNote(viewNote.id); setViewNote(null); }}>
                                 Delete Note
                             </Button>
                         )}
                         <Button onClick={() => setViewNote(null)}>Close</Button>
                    </DialogFooter>
                 </>
             )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
