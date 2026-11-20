import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, Note, DocumentItem, ChatMessage, ActivityItem, UserSettings } from '../types';

interface AppContextType {
  tasks: Task[];
  notes: Note[];
  documents: DocumentItem[];
  chatMessages: ChatMessage[];
  activities: ActivityItem[];
  userSettings: UserSettings;
  isWorkspaceEntered: boolean;

  // Stats
  tasksCompleted: number;
  totalTasks: number;
  documentsSaved: number;
  knowledgeNotes: number;
  productivityScore: number;
  taskProgressPercent: number;

  // Actions
  enterWorkspace: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  deleteDocument: (id: string) => void;

  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  updateUserSettings: (settings: Partial<UserSettings>) => void;
  resetToDefaults: () => void;
  clearAllData: () => void;
}

const STORAGE_KEYS = {
  TASKS: 'nova_tasks_v1',
  NOTES: 'nova_notes_v1',
  DOCUMENTS: 'nova_documents_v1',
  CHAT: 'nova_chat_v1',
  ACTIVITIES: 'nova_activities_v1',
  SETTINGS: 'nova_settings_v1',
  ONBOARDED: 'nova_onboarded_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
  displayName: 'Alex Mercer',
  email: 'alex.mercer@nova-hub.ai',
  role: 'AI Product Architect',
  theme: 'dark',
  notifications: true,
  soundEffects: true,
  autoSummarize: true,
  dailyGoalTasks: 5,
};

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Audit multi-modal transformer token usage',
    description: 'Review inference budget and latency profiles for Q3 intelligence workloads.',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    category: 'Architecture',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Synthesize autonomous agents whitepaper',
    description: 'Extract key architectural findings and evaluate local edge runtime viability.',
    priority: 'High',
    status: 'Completed',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    category: 'Research',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    completedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Refactor Knowledge Vault indexing pipeline',
    description: 'Implement inverted index and fast tag filtering in browser LocalStorage.',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date(Date.now() - 100000).toISOString().split('T')[0],
    category: 'Engineering',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    completedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Calibrate Eisenhower focus matrix for sprint',
    description: 'Ensure quadrant 2 strategic goals have dedicated uninterrupted morning blocks.',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    category: 'Strategy',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Review team productivity analytics report',
    description: 'Analyze weekly velocity trends, deep work distribution, and focus ratings.',
    priority: 'Low',
    status: 'Pending',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    category: 'Operations',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Principles of Ambient Intelligence in SaaS',
    content: `Ambient intelligence should operate proactively without demanding user attention.
Key tenants:
1. Frictionless background extraction and deterministic synthesis.
2. Zero external latency: all instant interactions run locally.
3. Radical data sovereignty: zero mandatory telemetry, strict on-device storage.
4. Seamless crossover between knowledge capture and task execution.`,
    tags: ['Architecture', 'AI Systems', 'Product Design'],
    category: 'Strategy',
    isPinned: true,
    createdAt: new Date(Date.now() - 180000000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'note-2',
    title: 'The PARA Method: Implementation Blueprint',
    content: `Organize all digital assets into 4 crisp buckets:
- Projects: Direct deliverables with defined horizons (e.g., NOVA Launch v1).
- Areas: Ongoing standards (Health, Engineering Quality, Finance).
- Resources: Reference libraries, design tokens, prompt architectures.
- Archives: Inactive completions preserved for recall.`,
    tags: ['Productivity', 'SecondBrain', 'Framework'],
    category: 'Frameworks',
    isPinned: true,
    createdAt: new Date(Date.now() - 240000000).toISOString(),
    updatedAt: new Date(Date.now() - 120000000).toISOString(),
  },
  {
    id: 'note-3',
    title: 'Prompt Architecture & Evaluation Metrics',
    content: `Effective prompts follow the C-T-F pattern:
- Context: Situational frame & persona constraints.
- Task: Atomic, high-fidelity command with boundaries.
- Format: Structured markdown, tables, or JSON without filler prose.`,
    tags: ['PromptEngineering', 'NLP', 'Cheatsheet'],
    category: 'Research',
    isPinned: false,
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    updatedAt: new Date(Date.now() - 90000000).toISOString(),
  },
];

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-sample-1',
    name: 'Executive_Brief_Autonomous_Workflows.pdf',
    size: 428000,
    type: 'application/pdf',
    uploadDate: new Date(Date.now() - 172800000).toISOString(),
    rawText: `Autonomous agents represent a fundamental shift in computing architecture. Unlike traditional reactive interfaces that wait for step-by-step human instructions, goal-driven personal intelligence systems maintain an ongoing loop of perception, planning, tool execution, and reflection.

Key findings indicate that on-device processing drastically reduces latency while guaranteeing absolute user confidentiality. Deterministic local text synthesis models are capable of extracting high-signal summaries from complex documents without requiring cloud API round-trips.

In conclusion, the future of personal intelligence workspaces relies on the tight integration of local document parsing, structured knowledge repositories, and adaptive task planning within a unified visual environment.`,
    wordCount: 104,
    readingTimeMin: 1,
    summary: 'Autonomous agents represent a fundamental shift in computing architecture by maintaining an ongoing loop of perception, planning, tool execution, and reflection. Key findings demonstrate that local processing eliminates network latency and guarantees total data privacy.',
    keyPoints: [
      'Shift from reactive interfaces to goal-driven perception, planning, and execution.',
      'On-device deterministic synthesis eliminates cloud latency and secures privacy.',
      'Tight integration of document intelligence and task planning unifies personal workflow.',
      'Local-first architectures empower sovereign user data control.'
    ],
    keywords: ['Autonomous', 'Agents', 'Intelligence', 'Latency', 'Privacy', 'Synthesis'],
    status: 'ready',
  },
  {
    id: 'doc-sample-2',
    name: 'Deep_Work_Schedules_Spec.txt',
    size: 15400,
    type: 'text/plain',
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
    rawText: `To achieve maximum cognitive output, knowledge workers require minimum 90-minute blocks of uninterrupted focus. High-priority tasks should be executed during chronobiological peak hours (typically 8:00 AM - 11:30 AM). Asynchronous communication must replace real-time chat interruptions. Structured daily shutdown routines reduce cognitive residue and improve subsequent recovery.`,
    wordCount: 52,
    readingTimeMin: 1,
    summary: 'Knowledge workers require uninterrupted 90-minute focus blocks scheduled during morning peak hours to maximize cognitive performance and eliminate task switching residue.',
    keyPoints: [
      'Reserve 90-minute uninterrupted focus windows for High-Priority tasks.',
      'Schedule deep work during morning peak energy windows.',
      'Replace distracting real-time chat interruptions with asynchronous batching.',
      'Daily shutdown rituals eliminate residual cognitive friction.'
    ],
    keywords: ['Focus', 'Schedules', 'DeepWork', 'Cognitive', 'Productivity'],
    status: 'ready',
  }
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'chat-0',
    sender: 'nova',
    text: `### Welcome to NOVA Intelligence Hub

I am your personal AI productivity co-pilot. I run local deterministic synthesis models to help you:
- **Deconstruct complex objectives** into actionable task milestones.
- **Synthesize long documents & PDFs** into concise executive briefs.
- **Surface high-leverage frameworks** (e.g. Eisenhower Matrix, PARA, Second Brain).

Feel free to choose a suggested prompt below or enter any request!`,
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    category: 'general',
    suggestedFollowUps: [
      'Explain the PARA method for my Knowledge Vault',
      'Give me a 5-day high-performance sprint plan',
      'How does local PDF intelligence work?'
    ]
  }
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'task',
    title: 'Completed Task',
    description: 'Synthesize autonomous agents whitepaper',
    timestamp: '1 hour ago',
  },
  {
    id: 'act-2',
    type: 'document',
    title: 'Document Analyzed',
    description: 'Executive_Brief_Autonomous_Workflows.pdf parsed & summarized',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-3',
    type: 'note',
    title: 'Saved Note',
    description: 'Principles of Ambient Intelligence in SaaS added to Vault',
    timestamp: '3 hours ago',
  },
  {
    id: 'act-4',
    type: 'assistant',
    title: 'Intelligence Session',
    description: 'Generated sprint execution plan with NOVA Assistant',
    timestamp: 'Yesterday',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
      return saved ? JSON.parse(saved) : INITIAL_CHAT;
    } catch {
      return INITIAL_CHAT;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isWorkspaceEntered, setIsWorkspaceEntered] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
    } catch {
      return true; // default true for convenience
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (e) {
      console.error(e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    } catch (e) {
      console.error(e);
    }
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(userSettings));
    } catch (e) {
      console.error(e);
    }
  }, [userSettings]);

  const enterWorkspace = () => {
    setIsWorkspaceEntered(true);
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  };

  const addActivity = (type: ActivityItem['type'], title: string, description: string) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      timestamp: 'Just now',
    };
    setActivities(prev => [newAct, ...prev.slice(0, 19)]);
  };

  // Task actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    addActivity('task', 'New Task Created', newTask.title);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const isDone = t.status === 'Completed';
          const nextStatus = isDone ? 'Pending' : 'Completed';
          if (!isDone) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#8B5CF6', '#22D3EE', '#F8FAFC']
            });
            addActivity('task', 'Task Completed', t.title);
          }
          return {
            ...t,
            status: nextStatus,
            completedAt: !isDone ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Note actions
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    addActivity('note', 'Note Created', newNote.title);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Document actions
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString(),
    };
    setDocuments(prev => [newDoc, ...prev]);
    addActivity('document', 'Document Analyzed', `${newDoc.name} (${newDoc.wordCount} words)`);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Chat actions
  const addChatMessage = (msgData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: `chat-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, newMsg]);
    if (msgData.sender === 'user') {
      addActivity('assistant', 'Assistant Prompt', msgData.text.slice(0, 45) + '...');
    }
  };

  const clearChat = () => {
    setChatMessages(INITIAL_CHAT);
  };

  const updateUserSettings = (updates: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    setDocuments(INITIAL_DOCUMENTS);
    setChatMessages(INITIAL_CHAT);
    setActivities(INITIAL_ACTIVITIES);
    setUserSettings(DEFAULT_SETTINGS);
    setIsWorkspaceEntered(true);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(INITIAL_CHAT));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  };

  const clearAllData = () => {
    setTasks([]);
    setNotes([]);
    setDocuments([]);
    setChatMessages(INITIAL_CHAT);
    setActivities([]);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  };

  // Computed metrics
  const tasksCompleted = tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = tasks.length;
  const documentsSaved = documents.length;
  const knowledgeNotes = notes.length;

  const taskProgressPercent = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  // Real-time productivity score calculation
  const productivityScore = Math.min(
    100,
    Math.max(
      20,
      Math.round(
        (tasksCompleted * 12) +
        (documentsSaved * 10) +
        (knowledgeNotes * 8) +
        (taskProgressPercent * 0.25) +
        20
      )
    )
  );

  return (
    <AppContext.Provider
      value={{
        tasks,
        notes,
        documents,
        chatMessages,
        activities,
        userSettings,
        isWorkspaceEntered,
        tasksCompleted,
        totalTasks,
        documentsSaved,
        knowledgeNotes,
        productivityScore,
        taskProgressPercent,
        enterWorkspace,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        addNote,
        updateNote,
        deleteNote,
        addDocument,
        deleteDocument,
        addChatMessage,
        clearChat,
        updateUserSettings,
        resetToDefaults,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
