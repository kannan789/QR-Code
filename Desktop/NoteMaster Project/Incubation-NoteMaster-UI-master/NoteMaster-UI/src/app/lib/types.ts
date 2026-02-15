export type Role = 'ADMIN' | 'USER';
export type AccessType = 'READ' | 'WRITE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  assignedVerticals: string[]; // Vertical IDs
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Vertical {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Subtitle {
  id: string;
  verticalId: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type NoteStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Note {
  id: string;
  verticalId: string;
  subtitleId: string;
  authorId: string;
  question: string;
  answer: string; // Rich text (html) or plain text for this demo
  companyName: string;
  status: NoteStatus;
  createdAt: string;
  tags: string[];
}
