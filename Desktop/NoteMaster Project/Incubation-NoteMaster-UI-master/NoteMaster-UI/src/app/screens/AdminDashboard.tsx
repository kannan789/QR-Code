import React from 'react';
import { useApp } from '@/app/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { Users, Layers, FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const { users, verticals, notes } = useApp();

  const totalUsers = users.length;
  const totalVerticals = verticals.length;
  const totalNotes = notes.length;
  const pendingNotes = notes.filter(n => n.status === 'PENDING').length;
  const approvedNotes = notes.filter(n => n.status === 'APPROVED').length;

  const chartData = [
    { name: 'Pending', value: pendingNotes },
    { name: 'Approved', value: approvedNotes },
    { name: 'Rejected', value: notes.filter(n => n.status === 'REJECTED').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-slate-500">+2 since last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Verticals</CardTitle>
                <Layers className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalVerticals}</div>
                <p className="text-xs text-slate-500">Across 3 industries</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Notes</CardTitle>
                <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{pendingNotes}</div>
                <p className="text-xs text-slate-500">Requires attention</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Notes</CardTitle>
                <CheckCircle className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{approvedNotes}</div>
                <p className="text-xs text-slate-500">{Math.round((approvedNotes / (totalNotes || 1)) * 100)}% approval rate</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Note Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {notes.slice(0, 5).map((note) => (
                        <div key={note.id} className="flex items-center">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{note.companyName}</p>
                                <p className="text-sm text-slate-500 truncate max-w-[200px]">{note.question}</p>
                            </div>
                            <div className="ml-auto font-medium text-xs">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
