import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Paperclip,
  CheckCircle2,
  RefreshCw,
  User,
} from 'lucide-react';

interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    return [
      {
        id: 'msg-0',
        sender: 'assistant',
        content: `Hello ${user?.full_name}! I am your UniSphere Campus AI Assistant. I can answer academic questions, summarize course notes, track your attendance, explain complex engineering algorithms, and check upcoming deadlines. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    'What is my attendance in Cloud Computing?',
    'When is my next assignment deadline?',
    'Explain the shift-reduce parsing algorithm in Compiler Design',
    'What are the eligibility requirements for the Google placement drive?',
    'Show my fee clearance and receipt status',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Voice Input using Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSendPrompt = (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt) return;

    const userMsg: AIMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    // AI Contextual Response engine
    setTimeout(() => {
      let reply = '';
      const lower = prompt.toLowerCase();

      if (lower.includes('attendance') && lower.includes('cloud')) {
        reply = `Your attendance in **Cloud Computing & Distributed Systems (CS601)** is currently **92.0%** (23 out of 25 lectures attended). You are well above the university mandatory 75% threshold!`;
      } else if (lower.includes('assignment') || lower.includes('deadline')) {
        reply = `You have 1 upcoming coursework deadline:\n- **Kubernetes Cluster Deployment and Ingress Setup** for CS601 (Cloud Computing), due on **Friday, March 7 at 11:59 PM**.\n- You can upload your submission directly in the **My Academics** tab.`;
      } else if (lower.includes('parsing') || lower.includes('compiler')) {
        reply = `**Shift-Reduce Parsing Overview:**\nShift-reduce is a bottom-up parsing strategy that constructs parse trees from leaves to root.\n1. **Shift Action**: Shifts the next input token onto the parse stack.\n2. **Reduce Action**: Replaces a substring on top of the stack matching a grammar production right-hand side with its corresponding non-terminal.\n3. **Accept**: Reached when stack contains the start symbol and input is empty.\n4. **Conflict Types**: Shift/Reduce conflicts and Reduce/Reduce conflicts, resolved via Operator Precedence or LR(1)/LALR tables.`;
      } else if (lower.includes('google') || lower.includes('placement')) {
        reply = `**Google India Associate Cloud Engineer Drive Details:**\n- **Package**: ₹24.5 LPA\n- **Eligibility**: Minimum CGPA 8.0 (Your CGPA is **8.85** - You are eligible!)\n- **Eligible Branches**: CSE, ECE, AIML\n- **Drive Date**: March 30, 2026\n- You have already submitted your 1-click application in the **Career** tab.`;
      } else if (lower.includes('fee') || lower.includes('receipt')) {
        reply = `Your Semester 6 fee of **₹90,000** has been fully paid via Razorpay. Your verified receipt **#REC-2026-CS-0042** is available for download in the Fees & Payments section.`;
      } else {
        reply = `I have analyzed your query: "${prompt}". Based on your current Semester 6 Computer Science curriculum, your academic progress is exemplary (CGPA 8.85, 88.4% attendance). Feel free to ask about specific syllabus modules, exam schedules, or coding doubts in Python/TypeScript/PostgreSQL!`;
      }

      const aiMsg: AIMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-brand-500 text-white">
            <Bot className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            UniSphere AI Campus Copilot
          </h1>
          <Badge variant="brand">RLS-Protected Context</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Academic doubt solver, attendance auditor, timetable query engine, and personalized study assistant
        </p>
      </div>

      {/* Quick Question Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(chip)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-brand-500" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <Card className="h-[600px] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className="mt-1 text-[10px] opacity-70 text-right">{m.timestamp}</div>
              </div>

              {m.sender === 'user' && (
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={user?.full_name}
                  className="w-8 h-8 rounded-xl object-cover shrink-0"
                />
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                <span>UniSphere AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <button
            onClick={() => alert('PDF document context upload for academic notes Q&A.')}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Attach Coursework PDF"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Ask anything about your courses, attendance, exams, doubts... (or use voice)"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <button
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl transition ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Web Speech Voice Input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <Button
            variant="primary"
            size="md"
            icon={<Send className="w-4 h-4" />}
            onClick={() => handleSendPrompt()}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
