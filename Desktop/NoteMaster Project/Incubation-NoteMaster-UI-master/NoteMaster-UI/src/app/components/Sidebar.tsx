import React from 'react';
import { useApp } from '@/app/context/AppContext';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/Button';
import { LayoutDashboard, Layers, Library, Users, FileCheck, LogOut, Menu, NotebookPen, Search } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen }: SidebarProps) {
  const { currentUser, logout } = useApp();

  const isAdmin = currentUser?.role === 'ADMIN';

  const adminLinks = [
    { view: 'admin_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'verticals', label: 'Verticals', icon: Layers },
    { view: 'users', label: 'Users', icon: Users },
    { view: 'approvals', label: 'Approvals', icon: FileCheck },
  ];

  const userLinks = [
    { view: 'user_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'verticals', label: 'Verticals', icon: Layers },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-slate-200 transition-transform lg:translate-x-0 lg:static lg:inset-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center px-6 border-b border-slate-200">
           <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3">
             <NotebookPen className="text-white h-5 w-5" />
           </div>
           <span className="text-lg font-bold text-slate-900">NoteMaster</span>
        </div>

        <div className="flex flex-col p-4 space-y-1">
          {links.map((link) => (
            <Button
              key={link.view}
              variant={currentView === link.view ? 'secondary' : 'ghost'}
              className="justify-start w-full"
              onClick={() => {
                setCurrentView(link.view);
                setIsOpen(false);
              }}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.label}
            </Button>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center p-2 mb-4 rounded-lg bg-slate-50 border border-slate-100">
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1767362828069-3a8c5324be53?w=100&h=100&fit=crop"} 
              alt="User" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3 overflow-hidden flex flex-col items-start">
              <p className="text-sm font-medium text-slate-900 truncate w-full">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 truncate w-full mb-1" title={currentUser?.email}>{currentUser?.email}</p>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize",
                isAdmin ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"
              )}>
                {currentUser?.role.toLowerCase()}
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}
