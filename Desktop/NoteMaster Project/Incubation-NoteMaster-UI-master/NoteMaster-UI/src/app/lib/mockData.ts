import { Note, Subtitle, User, Vertical } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1767362828069-3a8c5324be53?w=150&h=150&fit=crop',
    assignedVerticals: [],
    status: 'ACTIVE'
  },
  {
    id: 'u2',
    name: 'Sarah Analyst',
    email: 'sarah@example.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    assignedVerticals: ['v1', 'v2'],
    status: 'ACTIVE'
  },
  {
    id: 'u3',
    name: 'Mike Researcher',
    email: 'mike@example.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
    assignedVerticals: ['v2'],
    status: 'INACTIVE'
  }
];

export const MOCK_VERTICALS: Vertical[] = [
  { 
    id: 'v1', 
    name: 'Java', 
    logoUrl: 'https://images.unsplash.com/photo-1664570000007-db164768644d?w=100&h=100&fit=crop',
    description: 'Object-oriented programming language', 
    status: 'ACTIVE' 
  },
  { 
    id: 'v2', 
    name: 'Python', 
    logoUrl: 'https://images.unsplash.com/photo-1667372531881-6f975b1c86db?w=100&h=100&fit=crop',
    description: 'Data science and web development', 
    status: 'ACTIVE' 
  },
  { 
    id: 'v3', 
    name: 'React', 
    logoUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop',
    description: 'Frontend library for UI', 
    status: 'ACTIVE' 
  },
];

export const MOCK_SUBTITLES: Subtitle[] = [
  { id: 's1', verticalId: 'v1', name: 'Core Java', description: 'Fundamentals of Java', status: 'ACTIVE' },
  { id: 's2', verticalId: 'v1', name: 'Spring Boot', description: 'Enterprise Framework', status: 'ACTIVE' },
  { id: 's3', verticalId: 'v2', name: 'Django', description: 'Web Framework', status: 'ACTIVE' },
  { id: 's4', verticalId: 'v2', name: 'Pandas', description: 'Data Analysis', status: 'ACTIVE' },
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    verticalId: 'v1',
    subtitleId: 's1',
    authorId: 'u2',
    question: 'What is the projected growth of vertical SaaS in 2026?',
    answer: 'Vertical SaaS is expected to grow by 18% YoY driven by AI integration...',
    companyName: 'TechTrends Inc.',
    status: 'APPROVED',
    createdAt: '2026-01-15T10:00:00Z',
    tags: ['market size', 'growth'],
  },
  {
    id: 'n2',
    verticalId: 'v1',
    subtitleId: 's1',
    authorId: 'u2',
    question: 'Competitors in the CRM space for small businesses?',
    answer: 'HubSpot, Zoho, and Freshworks remain top contenders...',
    companyName: 'MarketWatch',
    status: 'PENDING',
    createdAt: '2026-01-28T14:30:00Z',
    tags: ['competition', 'crm'],
  },
  {
    id: 'n3',
    verticalId: 'v2',
    subtitleId: 's3',
    authorId: 'u3',
    question: 'Impact of new regulations on insulin pricing?',
    answer: 'New caps are expected to reduce margins but increase volume...',
    companyName: 'PharmaDaily',
    status: 'REJECTED',
    createdAt: '2026-01-20T09:15:00Z',
    tags: ['regulation', 'pricing'],
  }
];
