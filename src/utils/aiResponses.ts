export interface SuggestedPrompt {
  id: string;
  category: 'brainstorm' | 'summary' | 'planning' | 'explanation';
  label: string;
  prompt: string;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'p1',
    category: 'brainstorm',
    label: '🚀 SaaS Feature Ideas',
    prompt: 'Brainstorm 4 high-leverage features for an AI knowledge and productivity dashboard.'
  },
  {
    id: 'p2',
    category: 'planning',
    label: '📅 Weekly Sprint Plan',
    prompt: 'Create a focused 5-day execution plan to balance deep work, meetings, and fitness.'
  },
  {
    id: 'p3',
    category: 'summary',
    label: '📑 Executive Brief',
    prompt: 'Synthesize the core principles of effective asynchronous personal intelligence systems.'
  },
  {
    id: 'p4',
    category: 'explanation',
    label: '🧠 Second Brain Concept',
    prompt: 'Explain the PARA method (Projects, Areas, Resources, Archives) and how to apply it in NOVA.'
  },
  {
    id: 'p5',
    category: 'planning',
    label: '⚡ Prioritize Tasks',
    prompt: 'How should I prioritize tasks using the Eisenhower Matrix when everything feels urgent?'
  },
  {
    id: 'p6',
    category: 'brainstorm',
    label: '💡 Micro-Habit System',
    prompt: 'Give me 3 small friction-free habits that dramatically reduce cognitive overload.'
  }
];

export function generateAssistantResponse(userPrompt: string): { text: string; followUps: string[] } {
  const query = userPrompt.toLowerCase().trim();

  if (query.includes('para') || query.includes('second brain') || query.includes('organize notes')) {
    return {
      text: `### 🧠 The PARA Framework in NOVA

The **PARA Method** (developed by Tiago Forte) categorizes all digital knowledge by **actionability**:

1. **Projects (Most Active)**: Initiatives with a distinct goal and deadline. *(e.g., "Launch NOVA v1.0", "Complete quarterly tax filings")*
2. **Areas (Sustained Standards)**: Ongoing spheres of responsibility without a defined end date. *(e.g., "Health & Nutrition", "Engineering Excellence")*
3. **Resources (Topics of Interest)**: Curated topics and reference materials you may want in the future. *(e.g., "UI Design Systems", "Prompt Engineering")*
4. **Archives (Inactive)**: Completed or dormant items from the other three buckets.

> **NOVA Tip**: In your **Knowledge Vault**, apply tags like \`#project\`, \`#resource\`, and \`#area\` so you can filter by urgency in under 2 seconds.`,
      followUps: [
        'How do I migrate messy bookmarks into NOVA?',
        'What tags work best for high-frequency workflows?',
        'Suggest a weekly review routine'
      ]
    };
  }

  if (query.includes('sprint') || query.includes('plan') || query.includes('schedule') || query.includes('execution')) {
    return {
      text: `### 📅 High-Leverage 5-Day Sprint Architecture

Here is a balanced blueprint tailored for deep work and sustainable energy:

- **Monday (Architecture & Clarification)**: 
  - Complete 2 top-priority architectural decisions.
  - Review all incoming notes and triage the Task Planner.
- **Tuesday (Deep Work Execution)**: 
  - 3-hour uninterrupted morning focus block for primary deliverable.
  - Afternoon: Review document summaries in Document Intelligence.
- **Wednesday (Integration & Prototyping)**: 
  - Rapid iterative building; check off at least 3 medium-priority tasks.
- **Thursday (Refinement & Stress Testing)**: 
  - Audit analytics metrics to identify productivity bottlenecks.
  - Zero-inbox on Knowledge Vault notes.
- **Friday (Synthesis & Retrospective)**: 
  - Archive completed tasks; conduct a 20-minute weekly review.
  - Celebrate wins and set top 3 objectives for next week.`,
      followUps: [
        'How do I maintain focus without burnout?',
        'Add these items to my Task Planner',
        'Help me identify productivity bottlenecks'
      ]
    };
  }

  if (query.includes('eisenhower') || query.includes('priorit') || query.includes('urgent')) {
    return {
      text: `### ⚡ The Eisenhower Decision Matrix

When everything feels like a firesale, categorize items across **Urgency vs. Importance**:

| Quadrant | Type | Immediate Action |
| :--- | :--- | :--- |
| **Q1: Urgent & Important** | Crises, tight deadlines | Do immediately (Set to **High Priority** in NOVA) |
| **Q2: Not Urgent, Important** | Strategy, learning, health | **Schedule with Due Dates** (The engine of real progress) |
| **Q3: Urgent, Not Important** | Interruptions, noise | Automate, delegate, or batch |
| **Q4: Neither** | Mindless busywork | Eliminate or limit to < 30 min |

> **Action Step**: Go to **Task Planner** and convert any "High Priority" tasks that don't have imminent deadlines into "Medium" with an assigned calendar date.`,
      followUps: [
        'Show me my pending High Priority tasks',
        'How to prevent Q1 crises before they happen',
        'Give me a technique for eliminating Q4 distractions'
      ]
    };
  }

  if (query.includes('feature') || query.includes('brainstorm') || query.includes('ideas') || query.includes('saas')) {
    return {
      text: `### 🚀 4 High-Leverage Features for Personal Intelligence Hubs

1. **Contextual Document Graph**: Connect uploaded research papers, PDFs, and notes visually into an interactive knowledge cluster.
2. **Automated Executive Digest**: Generate a daily 3-bullet morning dispatch synthesizing pending deliverables, unread notes, and focus targets.
3. **Proactive Calendar Sync & Time-Blocking**: Seamlessly suggest reserved time blocks when a High-Priority task is added to the planner.
4. **Semantic Memory Retrieval**: Instantly recall relevant snippets from past meetings and notes when drafting new documentation.

*These features combine offline speed, deterministic privacy, and actionable personal analytics.*`,
      followUps: [
        'Draft a product specification for Contextual Document Graph',
        'How would offline privacy guarantee work here?',
        'What UI component best visualizes this?'
      ]
    };
  }

  if (query.includes('summary') || query.includes('brief') || query.includes('synthesize') || query.includes('document')) {
    return {
      text: `### 📑 Synthesis: Asynchronous Personal Intelligence Systems

Modern knowledge workers face chronic **context fragmentation** across disjointed tabs, task lists, and PDFs. Key design pillars for unified intelligence:

- **Local-First Speed**: Instant search and retrieval with zero latency and robust local persistence.
- **Deterministic Extractive Synthesis**: Rapid filtering of signal from noise without relying on cloud servers or subscription locks.
- **Closed-Loop Feedback**: Ensuring that tasks, documents, and notes feed directly into unified **Productivity Analytics**.

> **NOVA Advantage**: You can drop any PDF or TXT into **Document Intelligence** right now to extract core sentences and keywords on device.`,
      followUps: [
        'Test document upload with sample paper',
        'How does NOVA extract text locally?',
        'Export this summary into Knowledge Vault'
      ]
    };
  }

  if (query.includes('habit') || query.includes('routine') || query.includes('productivity')) {
    return {
      text: `### 💡 3 Friction-Free Micro-Habits for Peak Clarity

1. **The "Two-Minute Rule" for Capture**: If a thought or task enters your mind, save it into the Knowledge Vault or Task Planner within 10 seconds, then immediately return to your current task.
2. **Shutdown Ritual**: Spend 5 minutes at the end of the day closing tabs, marking completed items in NOVA, and naming tomorrow's single "Non-Negotiable Task".
3. **Single-Tasking Windows**: Work in 45-minute distraction-free blocks with a 10-minute active recharge (standing, hydration, natural light).`,
      followUps: [
        'Add Shutdown Ritual as a recurring task',
        'How to track productivity score in Analytics?',
        'Best morning routine for developers'
      ]
    };
  }

  // Adaptive general response
  return {
    text: `### 🤖 NOVA Intelligence Analysis

I have processed your request: **"${userPrompt}"**

**Key Strategic Insights:**
- **Clarity of Intent**: Deconstruct complex goals into bite-sized, measurable milestones in your **Task Planner**.
- **Knowledge Retention**: Save critical takeaways and reference snippets into your **Knowledge Vault** for permanent recall.
- **Actionable Execution**: Maintain a high ratio of execution over passive consumption to maximize your **Productivity Score**.

> *Note: This response is powered by NOVA's local deterministic intelligence simulator, running entirely within your browser for speed, privacy, and zero API costs.*`,
    followUps: [
      'Create a task related to this',
      'Save this insight to Knowledge Vault',
      'Explain this further with concrete examples'
    ]
  };
}
