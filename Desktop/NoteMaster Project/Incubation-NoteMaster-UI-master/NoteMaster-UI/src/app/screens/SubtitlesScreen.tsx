import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/Dialog';
import { Badge } from '@/app/components/ui/Badge';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { Subtitle } from '@/app/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';

export function SubtitlesScreen() {
  const { subtitles, verticals, addSubtitle, updateSubtitle, deleteSubtitle } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerticalFilter, setSelectedVerticalFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null);

  const [formData, setFormData] = useState<Partial<Subtitle>>({
    name: '',
    description: '',
    verticalId: '',
    status: 'ACTIVE',
  });

  const filteredSubtitles = subtitles.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVertical = selectedVerticalFilter === 'ALL' || s.verticalId === selectedVerticalFilter;
    return matchesSearch && matchesVertical;
  });

  const handleOpenModal = (subtitle?: Subtitle) => {
    if (subtitle) {
      setEditingSubtitle(subtitle);
      setFormData(subtitle);
    } else {
      setEditingSubtitle(null);
      setFormData({ 
          name: '', 
          description: '', 
          verticalId: verticals.length > 0 ? verticals[0].id : '', 
          status: 'ACTIVE' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.verticalId) return;

    if (editingSubtitle) {
      updateSubtitle({ ...editingSubtitle, ...formData } as Subtitle);
    } else {
      addSubtitle({
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      } as Subtitle);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Subtitles</h2>
           <p className="text-slate-500">Manage categories within verticals.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add Subtitle
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                className="pl-9" 
                placeholder="Search subtitles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="w-full sm:w-[200px]">
            <Select value={selectedVerticalFilter} onValueChange={setSelectedVerticalFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Vertical" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Verticals</SelectItem>
                    {verticals.map(v => (
                        <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Vertical</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {filteredSubtitles.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                No subtitles found.
                            </td>
                        </tr>
                    ) : (
                        filteredSubtitles.map((subtitle) => {
                            const vertical = verticals.find(v => v.id === subtitle.verticalId);
                            return (
                                <tr key={subtitle.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{subtitle.name}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="font-normal">
                                            {vertical?.name || 'Unknown'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{subtitle.description}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={subtitle.status === 'ACTIVE' ? 'success' : 'secondary'}>
                                            {subtitle.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(subtitle)}>
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => deleteSubtitle(subtitle.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
         </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingSubtitle ? 'Edit Subtitle' : 'Add Subtitle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="vertical">Vertical</Label>
                    <Select 
                        value={formData.verticalId} 
                        onValueChange={(val) => setFormData({...formData, verticalId: val})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select vertical" />
                        </SelectTrigger>
                        <SelectContent>
                            {verticals.map(v => (
                                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                        id="description" 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                        value={formData.status} 
                        onValueChange={(val: any) => setFormData({...formData, status: val})}
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
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
