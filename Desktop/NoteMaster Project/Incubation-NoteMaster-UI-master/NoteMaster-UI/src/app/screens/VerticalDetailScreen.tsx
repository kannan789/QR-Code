import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/app/components/ui/Dialog';
import { Badge } from '@/app/components/ui/Badge';
import { Plus, Pencil, Trash2, ArrowLeft, BookOpen, Lock } from 'lucide-react';
import { Vertical, Subtitle } from '@/app/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface VerticalDetailScreenProps {
  verticalId: string;
  onBack: () => void;
  onNavigateToSubtitle: (subtitleId: string) => void;
}

export function VerticalDetailScreen({ verticalId, onBack, onNavigateToSubtitle }: VerticalDetailScreenProps) {
  const { verticals, subtitles, currentUser, addSubtitle, updateSubtitle, deleteSubtitle, updateVertical } = useApp();
  const vertical = verticals.find(v => v.id === verticalId);
  
  const [isSubtitleModalOpen, setIsSubtitleModalOpen] = useState(false);
  const [isVerticalModalOpen, setIsVerticalModalOpen] = useState(false);
  
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null);
  
  // Subtitle Form
  const [subtitleForm, setSubtitleForm] = useState<Partial<Subtitle>>({
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  // Vertical Form
  const [verticalForm, setVerticalForm] = useState<Partial<Vertical>>({
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  if (!vertical) {
    return <div>Vertical not found</div>;
  }

  const isAdmin = currentUser?.role === 'ADMIN';

  const verticalSubtitles = subtitles.filter(s => s.verticalId === verticalId);

  // Subtitle Handlers
  const handleOpenSubtitleModal = (subtitle?: Subtitle) => {
    if (!isAdmin) return; // Guard

    if (subtitle) {
      setEditingSubtitle(subtitle);
      setSubtitleForm(subtitle);
    } else {
      setEditingSubtitle(null);
      setSubtitleForm({ 
          name: '', 
          description: '', 
          verticalId: verticalId, 
          status: 'ACTIVE' 
      });
    }
    setIsSubtitleModalOpen(true);
  };

  const handleSubtitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtitleForm.name || !subtitleForm.description) return;

    if (editingSubtitle) {
      updateSubtitle({ ...editingSubtitle, ...subtitleForm } as Subtitle);
    } else {
      addSubtitle({
        id: Math.random().toString(36).substr(2, 9),
        verticalId: verticalId,
        ...subtitleForm
      } as Subtitle);
    }
    setIsSubtitleModalOpen(false);
  };

  // Vertical Handlers
  const handleOpenVerticalModal = () => {
    if (!isAdmin) return;
    setVerticalForm(vertical);
    setIsVerticalModalOpen(true);
  };

  const handleVerticalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verticalForm.name || !verticalForm.description) return;
    updateVertical({ ...vertical, ...verticalForm } as Vertical);
    setIsVerticalModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4">
           {vertical.logoUrl ? (
             <ImageWithFallback src={vertical.logoUrl} alt={vertical.name} className="w-12 h-12 rounded-lg object-cover" />
           ) : (
             <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
               {vertical.name.charAt(0)}
             </div>
           )}
           <div>
              <h2 className="text-3xl font-bold tracking-tight">{vertical.name}</h2>
              <p className="text-slate-500">{vertical.description}</p>
           </div>
        </div>
        <div className="ml-auto">
             {isAdmin && (
                 <Button variant="outline" onClick={handleOpenVerticalModal}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Vertical
                 </Button>
             )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <h3 className="text-xl font-semibold">Subtitles</h3>
        {isAdmin && (
            <Button onClick={() => handleOpenSubtitleModal()} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Add Subtitle
            </Button>
        )}
      </div>

      <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {verticalSubtitles.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                {isAdmin ? 'No subtitles found. Create one to get started.' : 'No content available in this vertical yet.'}
                            </td>
                        </tr>
                    ) : (
                        verticalSubtitles.map((subtitle) => (
                            <tr 
                              key={subtitle.id} 
                              className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                              onClick={() => onNavigateToSubtitle(subtitle.id)}
                            >
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-slate-400" />
                                  {subtitle.name}
                                </td>
                                <td className="px-6 py-4 text-slate-500">{subtitle.description}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={subtitle.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                        {subtitle.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    {isAdmin ? (
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleOpenSubtitleModal(subtitle); }}>
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteSubtitle(subtitle.id); }}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700" onClick={() => onNavigateToSubtitle(subtitle.id)}>
                                            View Notes
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
         </div>
      </div>

      {/* Subtitle Modal - Only for Admin */}
      <Dialog open={isSubtitleModalOpen} onOpenChange={setIsSubtitleModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingSubtitle ? 'Edit Subtitle' : 'Add Subtitle'}</DialogTitle>
                <DialogDescription>
                    Fill in the details below to {editingSubtitle ? 'modify the' : 'create a new'} subtitle category.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubtitleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="sub-name">Name</Label>
                    <Input 
                        id="sub-name" 
                        value={subtitleForm.name} 
                        onChange={(e) => setSubtitleForm({...subtitleForm, name: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sub-desc">Description</Label>
                    <Input 
                        id="sub-desc" 
                        value={subtitleForm.description} 
                        onChange={(e) => setSubtitleForm({...subtitleForm, description: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sub-status">Status</Label>
                    <Select 
                        value={subtitleForm.status} 
                        onValueChange={(val: any) => setSubtitleForm({...subtitleForm, status: val})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSubtitleModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* Vertical Edit Modal - Only for Admin */}
      <Dialog open={isVerticalModalOpen} onOpenChange={setIsVerticalModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Vertical</DialogTitle>
                <DialogDescription>
                    Modify the details of this vertical.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerticalSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="vert-name">Name</Label>
                    <Input 
                        id="vert-name" 
                        value={verticalForm.name} 
                        onChange={(e) => setVerticalForm({...verticalForm, name: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vert-desc">Description</Label>
                    <Input 
                        id="vert-desc" 
                        value={verticalForm.description} 
                        onChange={(e) => setVerticalForm({...verticalForm, description: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vert-status">Status</Label>
                    <Select 
                        value={verticalForm.status} 
                        onValueChange={(val: any) => setVerticalForm({...verticalForm, status: val})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsVerticalModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
