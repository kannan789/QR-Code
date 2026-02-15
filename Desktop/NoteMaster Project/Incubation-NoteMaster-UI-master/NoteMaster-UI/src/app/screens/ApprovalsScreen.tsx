import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/app/components/ui/Dialog';
import { Check, X, Eye, Clock, Building2, Tag } from 'lucide-react';
import { Note } from '@/app/lib/types';
import { formatDate } from '@/app/lib/utils';

export function ApprovalsScreen() {
  const { notes, verticals, subtitles, users, approveNote, rejectNote } = useApp();
  const [selectedVertical, setSelectedVertical] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('PENDING'); // Default to PENDING
  const [viewNote, setViewNote] = useState<Note | null>(null);

  const filteredNotes = notes.filter(n => {
    const matchesVertical = selectedVertical === 'ALL' || n.verticalId === selectedVertical;
    const matchesStatus = selectedStatus === 'ALL' || n.status === selectedStatus;
    return matchesVertical && matchesStatus;
  });

  const getAuthorName = (authorId: string) => {
      return users.find(u => u.id === authorId)?.name || 'Unknown Author';
  };

  const getVerticalName = (vId: string) => verticals.find(v => v.id === vId)?.name;
  const getSubtitleName = (sId: string) => subtitles.find(s => s.id === sId)?.name;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Note Approvals</h2>
        <p className="text-slate-500">Review pending content submissions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-[200px]">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="w-full sm:w-[200px]">
            <Select value={selectedVertical} onValueChange={setSelectedVertical}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNotes.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p>No notes found matching current filters.</p>
              </div>
          ) : (
              filteredNotes.map((note) => (
                  <Card key={note.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                      <CardContent className="flex-1 p-6 space-y-4">
                          <div className="flex justify-between items-start">
                              <Badge variant="outline" className="bg-slate-50">
                                  {getVerticalName(note.verticalId)} / {getSubtitleName(note.subtitleId)}
                              </Badge>
                              <Badge variant={
                                  note.status === 'APPROVED' ? 'success' : 
                                  note.status === 'REJECTED' ? 'destructive' : 'warning'
                              }>
                                  {note.status}
                              </Badge>
                          </div>
                          
                          <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm text-slate-500">
                                  <Building2 className="h-3 w-3" />
                                  <span className="font-semibold text-slate-700">{note.companyName}</span>
                              </div>
                              <h3 className="font-semibold text-slate-900 leading-tight line-clamp-2">
                                  {note.question}
                              </h3>
                              <p className="text-sm text-slate-500 line-clamp-3">
                                  {note.answer}
                              </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                              {note.tags.map(tag => (
                                  <span key={tag} className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">
                                      #{tag}
                                  </span>
                              ))}
                          </div>
                      </CardContent>
                      
                      <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-lg flex items-center justify-between">
                          <div className="text-xs text-slate-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(note.createdAt)}
                          </div>
                          <div className="flex space-x-2">
                                <Button size="sm" variant="ghost" onClick={() => setViewNote(note)}>
                                    <Eye className="h-4 w-4 text-indigo-600" />
                                    <span className="sr-only">View</span>
                                </Button>
                                {note.status === 'PENDING' && (
                                    <>
                                        <Button size="sm" variant="ghost" className="hover:bg-green-50" onClick={() => approveNote(note.id)}>
                                            <Check className="h-4 w-4 text-green-600" />
                                            <span className="sr-only">Approve</span>
                                        </Button>
                                        <Button size="sm" variant="ghost" className="hover:bg-red-50" onClick={() => rejectNote(note.id)}>
                                            <X className="h-4 w-4 text-red-600" />
                                            <span className="sr-only">Reject</span>
                                        </Button>
                                    </>
                                )}
                          </div>
                      </div>
                  </Card>
              ))
          )}
      </div>

      <Dialog open={!!viewNote} onOpenChange={(open) => !open && setViewNote(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Note Details</DialogTitle>
                <DialogDescription>
                    Submitted by {viewNote && getAuthorName(viewNote.authorId)} on {viewNote && formatDate(viewNote.createdAt)}
                </DialogDescription>
            </DialogHeader>
            
            {viewNote && (
                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Vertical</label>
                            <p className="text-sm font-medium">{getVerticalName(viewNote.verticalId)}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Subtitle</label>
                            <p className="text-sm font-medium">{getSubtitleName(viewNote.subtitleId)}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Company</label>
                            <p className="text-sm font-medium">{viewNote.companyName}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                            <Badge variant={viewNote.status === 'APPROVED' ? 'success' : viewNote.status === 'REJECTED' ? 'destructive' : 'warning'}>
                                {viewNote.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 flex items-center">
                            Question
                        </label>
                        <div className="p-4 rounded-md bg-slate-50 border border-slate-100 text-slate-800">
                            {viewNote.question}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 flex items-center">
                            Answer
                        </label>
                        <div className="p-4 rounded-md bg-slate-50 border border-slate-100 text-slate-700 whitespace-pre-wrap">
                            {viewNote.answer}
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-semibold text-slate-500 uppercase">Tags</label>
                         <div className="flex flex-wrap gap-2">
                            {viewNote.tags.map(tag => (
                                <Badge key={tag} variant="secondary">#{tag}</Badge>
                            ))}
                         </div>
                    </div>
                </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setViewNote(null)}>Close</Button>
                {viewNote?.status === 'PENDING' && (
                    <>
                        <Button variant="destructive" onClick={() => { rejectNote(viewNote.id); setViewNote(null); }}>Reject</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { approveNote(viewNote.id); setViewNote(null); }}>Approve</Button>
                    </>
                )}
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
