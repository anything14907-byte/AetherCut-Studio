import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import {
  Sparkles,
  Send,
  Wand2,
  Terminal,
  Key,
  Flame,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

export default function TabAiDirector() {
  const { executeAiCommand, setIsApiKeyModalOpen, showToast } = useStudio();
  const [inputCommand, setInputCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Greetings Creator. I am your AI Co-Director. Tell me what to edit, split, color grade, caption, or generate.',
      time: 'Just now'
    }
  ]);

  const quickCommands = [
    'Split clip at 00:05',
    'Add bold yellow kinetic captions: Explore the unknown cosmos',
    'Apply cyberpunk color grade',
    'Change background music to cyberpunk synthwave',
    'Generate a 4-scene script about space exploration'
  ];

  const handleSend = async (cmdToSend) => {
    const text = (cmdToSend || inputCommand).trim();
    if (!text || isProcessing) return;

    setInputCommand('');
    setIsProcessing(true);

    // Append user message
    setMessages((prev) => [
      ...prev,
      { role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    try {
      const res = await executeAiCommand(text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res?.message || `Executed instruction: "${text}".`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          success: res?.success ?? true
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Error executing command: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          success: false
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-3.5 space-y-3 select-none text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00F2FE] to-[#8A2BE2] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-obsidian-950 font-bold" />
          </div>
          <span className="font-semibold text-white">AI Director Co-Pilot</span>
        </div>
        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          title="BYO Cloud API Key"
          className="text-[11px] text-slate-400 hover:text-[#00F2FE] flex items-center space-x-1"
        >
          <Key className="w-3 h-3" />
          <span>BYO Key</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[160px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl space-y-1 ${
              m.role === 'user'
                ? 'bg-[#181B26] border border-white/[0.1] text-slate-200 ml-4'
                : 'bg-[#11131A] border border-[#00F2FE]/20 text-slate-300 mr-2 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className={m.role === 'user' ? 'text-slate-400 font-mono' : 'text-[#00F2FE] font-mono font-bold'}>
                {m.role === 'user' ? 'YOU' : 'AI CO-DIRECTOR'}
              </span>
              <span>{m.time}</span>
            </div>
            <div className="text-xs leading-relaxed text-slate-200">
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Suggestions Chips */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] uppercase font-mono text-slate-400 flex items-center space-x-1">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>Instant Edit Directives</span>
        </span>
        <div className="flex flex-col space-y-1">
          {quickCommands.slice(0, 3).map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleSend(cmd)}
              className="text-left px-2.5 py-1.5 rounded-lg bg-[#11131A] hover:bg-[#181B26] border border-white/[0.06] text-slate-300 hover:text-[#00F2FE] transition-colors truncate text-[11px]"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Command Input Bar */}
      <div className="relative pt-1">
        <input
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Direct the editor (e.g., 'Split clip at 00:05')..."
          className="w-full bg-[#11131A] border border-white/[0.1] focus:border-[#00F2FE] rounded-xl px-3 py-2 pr-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputCommand.trim() || isProcessing}
          className="absolute right-2 top-2.5 p-1 rounded-md text-[#00F2FE] hover:bg-white/[0.08] disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

