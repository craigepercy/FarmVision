import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  threadId: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'message' | 'notification' | 'alert';
}

interface MessageThread {
  id: string;
  subject: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessagingState {
  messages: Message[];
  threads: MessageThread[];
  selectedThread: string | null;
  loading: boolean;
}

const initialState: MessagingState = {
  messages: [
    {
      id: '1',
      threadId: 'thread1',
      sender: 'System',
      recipient: 'User',
      subject: 'Field Analysis Complete',
      content: 'Your field analysis for North Field A has been completed. Results show optimal growing conditions.',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'notification',
    },
    {
      id: '2',
      threadId: 'thread2',
      sender: 'Farm Manager',
      recipient: 'User',
      subject: 'Equipment Maintenance Reminder',
      content: 'The John Deere 8320R is due for maintenance in 5 days. Please schedule accordingly.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      type: 'alert',
    },
  ],
  threads: [
    {
      id: 'thread1',
      subject: 'Field Analysis Complete',
      participants: ['System', 'User'],
      lastMessage: 'Your field analysis for North Field A has been completed.',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 1,
    },
    {
      id: 'thread2',
      subject: 'Equipment Maintenance Reminder',
      participants: ['Farm Manager', 'User'],
      lastMessage: 'The John Deere 8320R is due for maintenance in 5 days.',
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      unreadCount: 1,
    },
  ],
  selectedThread: null,
  loading: false,
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      const thread = state.threads.find(t => t.id === action.payload.threadId);
      if (thread) {
        thread.lastMessage = action.payload.content;
        thread.lastMessageTime = action.payload.timestamp;
        thread.unreadCount += 1;
      }
    },
    markMessageAsRead: (state, action: PayloadAction<string>) => {
      const message = state.messages.find(m => m.id === action.payload);
      if (message) {
        message.read = true;
      }
    },
    markThreadAsRead: (state, action: PayloadAction<string>) => {
      const thread = state.threads.find(t => t.id === action.payload);
      if (thread) {
        thread.unreadCount = 0;
      }
      state.messages.forEach(message => {
        if (message.threadId === action.payload) {
          message.read = true;
        }
      });
    },
    selectThread: (state, action: PayloadAction<string>) => {
      state.selectedThread = action.payload;
    },
    createNewThread: (state, action: PayloadAction<{ subject: string; recipient: string; content: string }>) => {
      const threadId = `thread${Date.now()}`;
      const messageId = `msg${Date.now()}`;
      
      const newThread: MessageThread = {
        id: threadId,
        subject: action.payload.subject,
        participants: ['User', action.payload.recipient],
        lastMessage: action.payload.content,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
      };
      
      const newMessage: Message = {
        id: messageId,
        threadId,
        sender: 'User',
        recipient: action.payload.recipient,
        subject: action.payload.subject,
        content: action.payload.content,
        timestamp: new Date().toISOString(),
        read: true,
        type: 'message',
      };
      
      state.threads.push(newThread);
      state.messages.push(newMessage);
    },
  },
});

export const { 
  addMessage, 
  markMessageAsRead, 
  markThreadAsRead, 
  selectThread, 
  createNewThread 
} = messagingSlice.actions;
export default messagingSlice.reducer;
