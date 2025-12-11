import React from 'react';
import { Message, AgentType } from '../types';
import { AGENT_METADATA } from '../constants';
import { ShieldAlert, BadgeDollarSign, FileText, CalendarCheck, Network, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystemLog = message.isDelegationLog;
  
  // Icon Mapping
  const getIcon = (agent?: AgentType) => {
    switch (agent) {
      case AgentType.MEDICAL_RECORDS: return <ShieldAlert size={18} className="text-white" />;
      case AgentType.BILLING_INSURANCE: return <BadgeDollarSign size={18} className="text-white" />;
      case AgentType.PATIENT_INFO: return <FileText size={18} className="text-white" />;
      case AgentType.APPOINTMENT_SCHEDULER: return <CalendarCheck size={18} className="text-white" />;
      case AgentType.NAVIGATOR: return <Network size={18} className="text-white" />;
      default: return <Network size={18} className="text-white" />;
    }
  };

  const agentMeta = message.agent ? AGENT_METADATA[message.agent] : AGENT_METADATA[AgentType.NAVIGATOR];
  
  if (isSystemLog) {
    return (
      <div className="flex justify-center my-4 animate-fadeIn">
        <div className="bg-slate-100 border border-slate-200 text-slate-500 text-xs py-1 px-3 rounded-full flex items-center gap-2 font-mono">
          <Network size={12} />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
          ${isUser ? 'bg-indigo-500' : agentMeta.color}`}>
          {isUser ? <User size={16} className="text-white" /> : getIcon(message.agent)}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {!isUser && (
            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ml-1 ${agentMeta.textColor}`}>
              {agentMeta.name}
            </span>
          )}
          
          <div className={`relative px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
            ${isUser 
              ? 'bg-indigo-500 text-white rounded-br-none' 
              : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
            }`}>
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
          
          <span className="text-[10px] text-slate-300 mt-1 mx-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
