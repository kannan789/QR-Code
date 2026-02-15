import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/app/components/ui/Card';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/app/components/ui/Dialog';
import { Badge } from '@/app/components/ui/Badge';
import { Plus, Pencil, Trash2, Search, ArrowRight, Lock } from 'lucide-react';
import { Vertical } from '@/app/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface VerticalsScreenProps {
  onNavigate: (verticalId: string) => void;
}

export function VerticalsScreen({ onNavigate }: VerticalsScreenProps) {
  const { verticals, currentUser, addVertical, updateVertical, deleteVertical } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVertical, setEditingVertical] = useState<Vertical | null>(null);

  const [formData, setFormData] = useState<Partial<Vertical>>({
    name: '',
    description: '',
    status: 'ACTIVE',
    logoUrl: '',
  });

  const canEdit = currentUser?.role === 'ADMIN';

  // Filter verticals based on user access
  const availableVerticals = verticals.filter(v => {
      if (currentUser?.role === 'ADMIN') return true;
      return currentUser?.assignedVerticals.includes(v.id);
  });

  const filteredVerticals = availableVerticals.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (e?: React.MouseEvent, vertical?: Vertical) => {
    if (e) e.stopPropagation(); // Prevent card click
    
    // Only admins can add/edit
    if (!canEdit) return;

    if (vertical) {
      setEditingVertical(vertical);
      setFormData(vertical);
    } else {
      setEditingVertical(null);
      setFormData({ name: '', description: '', status: 'ACTIVE', logoUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Only admins can delete
    if (!canEdit) return;

    if (confirm('Are you sure you want to delete this vertical?')) {
        deleteVertical(id);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    // Use a placeholder if no logo provided
    const finalData = {
        ...formData,
        logoUrl: formData.logoUrl || 'https://images.unsplash.com/photo-1628760584600-6c31148991e9?w=100&h=100&fit=crop'
    };

    if (editingVertical) {
      updateVertical({ ...editingVertical, ...finalData } as Vertical);
    } else {
      addVertical({
        id: Math.random().toString(36).substr(2, 9),
        ...finalData
      } as Vertical);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Verticals</h2>
           <p className="text-slate-500">
               {currentUser?.role === 'ADMIN' 
                ? 'Manage industry verticals and categories.' 
                : 'Browse your assigned verticals.'}
           </p>
        </div>
        {canEdit && (
            <Button onClick={(e) => handleOpenModal(e)} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Add Vertical
            </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                className="pl-9" 
                placeholder="Search verticals..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVerticals.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                <Lock className="h-10 w-10 text-slate-300 mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No verticals found</h3>
                <p className="max-w-sm mt-1">
                    {currentUser?.role === 'ADMIN' 
                     ? 'Create a vertical to get started.' 
                     : 'You haven\'t been assigned to any verticals yet. Please contact an administrator.'}
                </p>
            </div>
        ) : (
            filteredVerticals.map((vertical) => (
                <Card 
                    key={vertical.id} 
                    className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-slate-200 overflow-hidden"
                    onClick={() => onNavigate(vertical.id)}
                >
                    <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                        {vertical.logoUrl ? (
                            <ImageWithFallback 
                                src={vertical.logoUrl} 
                                alt={vertical.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                                <Search className="h-12 w-12" />
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                             <Badge variant={vertical.status === 'ACTIVE' ? 'success' : 'secondary'} className="bg-white/90 backdrop-blur-sm shadow-sm">
                                {vertical.status}
                             </Badge>
                        </div>
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center text-xl">
                            {vertical.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 text-sm line-clamp-2">{vertical.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between items-center text-sm text-slate-400">
                         <span className="group-hover:text-indigo-600 flex items-center transition-colors">
                            {currentUser?.role === 'ADMIN' ? 'Manage' : 'View Content'} <ArrowRight className="ml-1 h-3 w-3" />
                         </span>
                         
                         {canEdit && (
                             <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleOpenModal(e, vertical)}>
                                    <Pencil className="h-4 w-4 text-slate-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleDelete(e, vertical.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                             </div>
                         )}
                    </CardFooter>
                </Card>
            ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingVertical ? 'Edit Vertical' : 'Add Vertical'}</DialogTitle>
                <DialogDescription>
                    Fill in the details below to {editingVertical ? 'modify the' : 'create a new'} vertical.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                    <Input 
                        id="logoUrl" 
                        value={formData.logoUrl} 
                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                        placeholder="https://..."
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
