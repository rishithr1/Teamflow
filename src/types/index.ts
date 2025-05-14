export interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'away' | 'offline';
}

export interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  reactions: string[];
  hasThread: boolean;
  isPinned?: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface RecentChat {
  id: number;
  name: string;
  type: 'group' | 'direct';
  unread: number;
}

export interface AttachedFile {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  progress: number;
  uploading: boolean;
}

export interface TaskData {
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
  project: string;
}

export interface MeetingData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  participants: string[];
  domain: string;
}

export interface Activity {
  icon: string;
  text: string;
  time: string;
}

export interface MeetingRoom {
  room: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  nextMeeting: string;
}