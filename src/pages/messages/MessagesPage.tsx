import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MessageSquare, Send, User, CheckCheck } from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { Message } from '../../types';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dataService.getMessages().then(setMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    const newMsg = await dataService.sendMessage({
      sender_id: user?.id || 'b0000000-0000-0000-0000-000000000001',
      sender_name: user?.full_name || 'Aarav Sharma',
      content: inputContent,
      is_mine: true,
    });

    setMessages((prev) => [...prev, newMsg]);
    setInputContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Messages & Communication
          </h1>
          <Badge variant="brand">Realtime Channel</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Direct messaging between students, course instructors, and academic mentors
        </p>
      </div>

      {/* Chat Container */}
      <Card className="h-[650px] flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
              alt="Dr. Ramesh Kumar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Dr. Ramesh Kumar (Academic Mentor)
              </div>
              <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </div>
            </div>
          </div>
          <Badge variant="neutral">Course: CS601</Badge>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id || msg.is_mine;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-br-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-brand-500" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
        >
          <input
            type="text"
            placeholder="Type your academic inquiry or message..."
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button variant="primary" size="md" icon={<Send className="w-4 h-4" />} type="submit">
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
};
