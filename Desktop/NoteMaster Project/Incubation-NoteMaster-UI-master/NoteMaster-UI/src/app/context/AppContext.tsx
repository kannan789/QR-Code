import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Vertical, Subtitle, Note, Role } from '@/app/lib/types';
import { apiService } from '@/app/services/api';
import { toast } from 'sonner';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  verticals: Vertical[];
  subtitles: Subtitle[];
  notes: Note[];
  isLoading: boolean;
  login: (email: string, role: Role) => Promise<void>;
  logout: () => void;
  addVertical: (vertical: Vertical) => Promise<void>;
  updateVertical: (vertical: Vertical) => Promise<void>;
  deleteVertical: (id: string) => Promise<void>;
  addSubtitle: (subtitle: Subtitle) => Promise<void>;
  updateSubtitle: (subtitle: Subtitle) => Promise<void>;
  deleteSubtitle: (id: string) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  approveNote: (id: string) => Promise<void>;
  rejectNote: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedUsers, fetchedVerticals, fetchedSubtitles, fetchedNotes] = await Promise.all([
          apiService.getUsers(),
          apiService.getVerticals(),
          apiService.getSubtitles(),
          apiService.getNotes(),
        ]);
        setUsers(fetchedUsers);
        setVerticals(fetchedVerticals);
        setSubtitles(fetchedSubtitles);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Failed to load application data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const login = async (email: string, role: Role) => {
    try {
      const user = await apiService.login(email, role);
      if (user) {
        setCurrentUser(user);
        toast.success(`Welcome back, ${user.name}`);
      } else {
        toast.error("User not found");
      }
    } catch (e) {
      toast.error("Login failed");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info("Logged out");
  };

  const addVertical = async (v: Vertical) => {
    try {
      const newVertical = await apiService.createVertical(v);
      setVerticals(prev => [...prev, newVertical]);
      toast.success("Vertical created");
    } catch (e) {
      toast.error("Failed to create vertical");
    }
  };

  const updateVertical = async (v: Vertical) => {
    try {
      const updated = await apiService.updateVertical(v);
      setVerticals(prev => prev.map(item => item.id === updated.id ? updated : item));
      toast.success("Vertical updated");
    } catch (e) {
      toast.error("Failed to update vertical");
    }
  };

  const deleteVertical = async (id: string) => {
    try {
      await apiService.deleteVertical(id);
      setVerticals(prev => prev.filter(v => v.id !== id));
      toast.success("Vertical deleted");
    } catch (e) {
      toast.error("Failed to delete vertical");
    }
  };

  const addSubtitle = async (s: Subtitle) => {
    try {
        const newSubtitle = await apiService.createSubtitle(s);
        setSubtitles(prev => [...prev, newSubtitle]);
        toast.success("Subtitle created");
    } catch (e) {
        toast.error("Failed to create subtitle");
    }
  };

  const updateSubtitle = async (s: Subtitle) => {
    try {
        const updated = await apiService.updateSubtitle(s);
        setSubtitles(prev => prev.map(item => item.id === updated.id ? updated : item));
        toast.success("Subtitle updated");
    } catch (e) {
        toast.error("Failed to update subtitle");
    }
  };

  const deleteSubtitle = async (id: string) => {
    try {
        await apiService.deleteSubtitle(id);
        setSubtitles(prev => prev.filter(s => s.id !== id));
        toast.success("Subtitle deleted");
    } catch (e) {
        toast.error("Failed to delete subtitle");
    }
  };

  const addUser = async (u: User) => {
    try {
        const newUser = await apiService.createUser(u);
        setUsers(prev => [...prev, newUser]);
        toast.success("User created");
    } catch (e) {
        toast.error("Failed to create user");
    }
  };

  const updateUser = async (u: User) => {
    try {
        const updated = await apiService.updateUser(u);
        setUsers(prev => prev.map(item => item.id === updated.id ? updated : item));
        toast.success("User updated");
    } catch (e) {
        toast.error("Failed to update user");
    }
  };

  const addNote = async (n: Note) => {
    try {
        const newNote = await apiService.createNote(n);
        setNotes(prev => [...prev, newNote]);
        toast.success("Note submitted successfully");
    } catch (e) {
        toast.error("Failed to submit note");
    }
  };

  const updateNote = async (n: Note) => {
    try {
        const updated = await apiService.updateNote(n);
        setNotes(prev => prev.map(item => item.id === updated.id ? updated : item));
        toast.success("Note updated");
    } catch (e) {
        toast.error("Failed to update note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
        await apiService.deleteNote(id);
        setNotes(prev => prev.filter(n => n.id !== id));
        toast.success("Note deleted");
    } catch (e) {
        toast.error("Failed to delete note");
    }
  };

  const approveNote = async (id: string) => {
    try {
        const updated = await apiService.approveNote(id);
        if (updated) {
            setNotes(prev => prev.map(n => n.id === id ? updated : n));
            toast.success("Note approved");
        }
    } catch (e) {
        toast.error("Failed to approve note");
    }
  };

  const rejectNote = async (id: string) => {
    try {
        const updated = await apiService.rejectNote(id);
        if (updated) {
            setNotes(prev => prev.map(n => n.id === id ? updated : n));
            toast.success("Note rejected");
        }
    } catch (e) {
        toast.error("Failed to reject note");
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, verticals, subtitles, notes, isLoading,
      login, logout,
      addVertical, updateVertical, deleteVertical,
      addSubtitle, updateSubtitle, deleteSubtitle,
      addUser, updateUser,
      addNote, updateNote, deleteNote, approveNote, rejectNote
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
