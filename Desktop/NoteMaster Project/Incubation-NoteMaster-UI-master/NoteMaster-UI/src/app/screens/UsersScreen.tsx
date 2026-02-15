import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/app/components/ui/Dialog';
import { Badge } from '@/app/components/ui/Badge';
import { Plus, Pencil, Search, Shield, User as UserIcon, HelpCircle } from 'lucide-react';
import { User } from '@/app/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/Tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export function UsersScreen() {
  const { users, verticals, notes, addUser, updateUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('user');

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'USER',
    assignedVerticals: [],
    status: 'ACTIVE'
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const admins = filteredUsers.filter(u => u.role === 'ADMIN');
  const standardUsers = filteredUsers.filter(u => u.role === 'USER');

  const handleOpenModal = (user?: User, defaultRole?: 'ADMIN' | 'USER') => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({ 
          name: '', 
          email: '', 
          role: defaultRole || (activeTab === 'admin' ? 'ADMIN' : 'USER'), 
          assignedVerticals: [],
          status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      updateUser({ ...editingUser, ...formData } as User);
    } else {
      addUser({
        id: Math.random().toString(36).substr(2, 9),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
        status: 'ACTIVE',
        ...formData
      } as User);
    }
    setIsModalOpen(false);
  };

  const toggleVertical = (vId: string) => {
    const current = formData.assignedVerticals || [];
    if (current.includes(vId)) {
      setFormData({ ...formData, assignedVerticals: current.filter(id => id !== vId) });
    } else {
      setFormData({ ...formData, assignedVerticals: [...current, vId] });
    }
  };

  const UserTable = ({ users, type }: { users: User[], type: 'ADMIN' | 'USER' }) => (
    <div className="rounded-md border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Access Level</TableHead>
            <TableHead className="text-center w-[150px]">Content Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const userNotesCount = notes.filter(n => n.authorId === user.id).length;
            
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className={
                        user.status === 'ACTIVE' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }>
                        {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1">
                    {user.role === 'ADMIN' ? (
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                           <Shield className="h-3 w-3" /> Full System Access
                        </span>
                    ) : (
                        user.assignedVerticals.length > 0 ? (
                            <>
                              {user.assignedVerticals.slice(0, 2).map(vid => {
                                  const v = verticals.find(ver => ver.id === vid);
                                  return v ? (
                                    <Badge key={vid} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-normal">
                                        {v.name}
                                    </Badge>
                                  ) : null;
                              })}
                              {user.assignedVerticals.length > 2 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 font-normal cursor-help">
                                        +{user.assignedVerticals.length - 2} more
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="flex flex-col gap-1">
                                        {user.assignedVerticals.slice(2).map(vid => {
                                           const v = verticals.find(ver => ver.id === vid);
                                           return v ? <span key={vid}>{v.name}</span> : null;
                                        })}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </>
                        ) : (
                            <span className="text-sm text-slate-400 italic">No access assigned</span>
                        )
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                        <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                        {userNotesCount}
                    </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                    <Pencil className="h-4 w-4 text-slate-400 hover:text-indigo-600" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
           <p className="text-slate-500">Manage system administrators and standard users.</p>
        </div>
      </div>

      <Tabs defaultValue="user" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Admins
                </TabsTrigger>
                <TabsTrigger value="user" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Users
                </TabsTrigger>
            </TabsList>

            <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        className="pl-9 w-full sm:w-[250px]" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => handleOpenModal(undefined, activeTab === 'admin' ? 'ADMIN' : 'USER')} className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap">
                    <Plus className="mr-2 h-4 w-4" /> 
                    {activeTab === 'admin' ? 'Add Admin' : 'Add User'}
                </Button>
            </div>
        </div>

        <TabsContent value="admin" className="mt-0">
            {admins.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                    <Shield className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No administrators found matching your search.</p>
                </div>
            ) : (
                <UserTable users={admins} type="ADMIN" />
            )}
        </TabsContent>

        <TabsContent value="user" className="mt-0">
            {standardUsers.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                    <UserIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No users found matching your search.</p>
                </div>
            ) : (
                <UserTable users={standardUsers} type="USER" />
            )}
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
            <DialogHeader>
                <DialogTitle>
                    {editingUser ? 'Edit' : 'Add'} {formData.role === 'ADMIN' ? 'Administrator' : 'User'}
                </DialogTitle>
                <DialogDescription>
                    Fill in the details below to {editingUser ? 'update the' : 'create a new'} {formData.role === 'ADMIN' ? 'administrator' : 'user'} account.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                            id="name" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email"
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2 hidden">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                        value={formData.role} 
                        onValueChange={(val: any) => setFormData({...formData, role: val})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                    </Select>
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

                {formData.role === 'USER' && (
                    <div className="space-y-3">
                        <Label>Assigned Verticals</Label>
                        <p className="text-xs text-slate-500">Select which verticals this user can access.</p>
                        <div className="grid grid-cols-2 gap-3 p-4 rounded-md border border-slate-200 bg-slate-50/50 max-h-60 overflow-y-auto">
                            {verticals.map(v => (
                                <div key={v.id} className="flex items-center space-x-2">
                                    <input 
                                        type="checkbox" 
                                        id={`v-${v.id}`}
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={formData.assignedVerticals?.includes(v.id)}
                                        onChange={() => toggleVertical(v.id)}
                                    />
                                    <Label htmlFor={`v-${v.id}`} className="cursor-pointer font-normal text-sm">{v.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                        {editingUser ? 'Save Changes' : 'Create Account'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
