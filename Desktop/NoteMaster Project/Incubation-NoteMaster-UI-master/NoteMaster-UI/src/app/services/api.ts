import { Note, Subtitle, User, Vertical, Role } from '@/app/lib/types';
import { MOCK_USERS, MOCK_VERTICALS, MOCK_SUBTITLES, MOCK_NOTES } from '@/app/lib/mockData';

// Simulating a database delay
const DELAY = 300;

class ApiService {
  private users: User[] = [...MOCK_USERS];
  private verticals: Vertical[] = [...MOCK_VERTICALS];
  private subtitles: Subtitle[] = [...MOCK_SUBTITLES];
  private notes: Note[] = [...MOCK_NOTES];

  private async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, DELAY));
  }

  // --- Auth ---
  async login(email: string, role: Role): Promise<User | undefined> {
    await this.simulateDelay();
    let user = this.users.find(u => u.email === email && u.role === role);
    if (!user) {
        // Fallback for demo convenience
        user = this.users.find(u => u.role === role);
    }
    return user;
  }

  // --- Users ---
  async getUsers(): Promise<User[]> {
    await this.simulateDelay();
    return [...this.users];
  }

  async createUser(user: User): Promise<User> {
    await this.simulateDelay();
    this.users.push(user);
    return user;
  }

  async updateUser(user: User): Promise<User> {
    await this.simulateDelay();
    this.users = this.users.map(u => u.id === user.id ? user : u);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.simulateDelay();
    this.users = this.users.filter(u => u.id !== id);
  }

  // --- Verticals ---
  async getVerticals(): Promise<Vertical[]> {
    await this.simulateDelay();
    return [...this.verticals];
  }

  async createVertical(vertical: Vertical): Promise<Vertical> {
    await this.simulateDelay();
    this.verticals.push(vertical);
    return vertical;
  }

  async updateVertical(vertical: Vertical): Promise<Vertical> {
    await this.simulateDelay();
    this.verticals = this.verticals.map(v => v.id === vertical.id ? vertical : v);
    return vertical;
  }

  async deleteVertical(id: string): Promise<void> {
    await this.simulateDelay();
    this.verticals = this.verticals.filter(v => v.id !== id);
  }

  // --- Subtitles ---
  async getSubtitles(verticalId?: string): Promise<Subtitle[]> {
    await this.simulateDelay();
    if (verticalId) {
      return this.subtitles.filter(s => s.verticalId === verticalId);
    }
    return [...this.subtitles];
  }

  async createSubtitle(subtitle: Subtitle): Promise<Subtitle> {
    await this.simulateDelay();
    this.subtitles.push(subtitle);
    return subtitle;
  }

  async updateSubtitle(subtitle: Subtitle): Promise<Subtitle> {
    await this.simulateDelay();
    this.subtitles = this.subtitles.map(s => s.id === subtitle.id ? subtitle : s);
    return subtitle;
  }

  async deleteSubtitle(id: string): Promise<void> {
    await this.simulateDelay();
    this.subtitles = this.subtitles.filter(s => s.id !== id);
  }

  // --- Notes ---
  async getNotes(filters?: { verticalId?: string; subtitleId?: string }): Promise<Note[]> {
    await this.simulateDelay();
    let result = [...this.notes];
    if (filters?.verticalId) {
      result = result.filter(n => n.verticalId === filters.verticalId);
    }
    if (filters?.subtitleId) {
      result = result.filter(n => n.subtitleId === filters.subtitleId);
    }
    return result;
  }

  async createNote(note: Note): Promise<Note> {
    await this.simulateDelay();
    this.notes.push(note);
    return note;
  }

  async updateNote(note: Note): Promise<Note> {
    await this.simulateDelay();
    this.notes = this.notes.map(n => n.id === note.id ? note : n);
    return note;
  }

  async deleteNote(id: string): Promise<void> {
    await this.simulateDelay();
    this.notes = this.notes.filter(n => n.id !== id);
  }

  async approveNote(id: string): Promise<Note | undefined> {
    await this.simulateDelay();
    const note = this.notes.find(n => n.id === id);
    if (note) {
      note.status = 'APPROVED';
      this.notes = this.notes.map(n => n.id === id ? note : n);
    }
    return note;
  }

  async rejectNote(id: string): Promise<Note | undefined> {
    await this.simulateDelay();
    const note = this.notes.find(n => n.id === id);
    if (note) {
      note.status = 'REJECTED';
      this.notes = this.notes.map(n => n.id === id ? note : n);
    }
    return note;
  }
}

export const apiService = new ApiService();
