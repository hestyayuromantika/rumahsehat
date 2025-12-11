import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { GeminiService } from './services/geminiService';
import { Message, AgentType } from './types';
import ChatBubble from './components/ChatBubble';
import NetworkVisualizer from './components/NetworkVisualizer';
import { AGENT_METADATA } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      agent: AgentType.NAVIGATOR,
      content: "Hello. I am the **Hospital System Navigator**, your Medical AI Delegation Hub. \n\nI ensure your requests are handled securely by delegating them to our specialized units:\n\n* **Medical Records** (Security Mandate)\n* **Billing & Finance** (Transparency Mandate)\n* **Patient Admin** (Documentation Mandate)\n* **Scheduling** (Logistics Mandate)\n\nHow may I direct you today?",
      timestamp: Date.now(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Lazy initialization of the service to prevent re-creation on every render
  const geminiServiceRef = useRef<GeminiService | null>(null);
  
  const getGeminiService = () => {
    if (!geminiServiceRef.current) {
      geminiServiceRef.current = new GeminiService();
    }
    return geminiServiceRef.current;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || processing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setProcessing(true);
    setError(null);
    setActiveAgent(AgentType.NAVIGATOR); // Start with Navigator

    try {
      const service = getGeminiService();

      // 1. Send to Navigator (Router)
      const routingResult = await service.processNavigatorRequest(userMsg.content);

      if (routingResult.targetAgent) {
        // Log the delegation for the user to see transparency
        const logMsg: Message = {
          id: Date.now().toString() + '_log',
          role: 'system',
          content: `VALIDATED: Delegating to ${AGENT_METADATA[routingResult.targetAgent].name} Module`,
          timestamp: Date.now(),
          isDelegationLog: true,
        };
        setMessages((prev) => [...prev, logMsg]);
        setActiveAgent(routingResult.targetAgent);

        // 2. Execute the Specialist Agent (Simulated tool execution)
        // Artificial delay for UI effect of "switching modules"
        await new Promise(resolve => setTimeout(resolve, 800));

        const agentResponse = await service.executeSpecialistAgent(
          routingResult.targetAgent,
          routingResult.delegatedQuery
        );

        const responseMsg: Message = {
          id: Date.now().toString() + '_resp',
          role: 'model',
          agent: routingResult.targetAgent,
          content: agentResponse,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, responseMsg]);

      } else {
        // Navigator handled it directly (e.g., greeting)
        const responseMsg: Message = {
          id: Date.now().toString() + '_resp',
          role: 'model',
          agent: AgentType.NAVIGATOR,
          content: routingResult.delegatedQuery, // Use the text returned by Navigator
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, responseMsg]);
        setActiveAgent(null);
      }

    } catch (err: any) {
      console.error(err);
      setError("System Connection Error. Please verify API Key configuration.");
      const errorMsg: Message = {
        id: Date.now().toString() + '_err',
        role: 'system',
        content: "Error: Unable to process request. The delegation hub is offline.",
        timestamp: Date.now(),
        isDelegationLog: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setProcessing(false);
      // Keep active agent highlight for a moment, then reset if needed
      // but usually nice to leave it on the last used agent until next interaction
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      
      {/* Left Panel: Visualizer */}
      <NetworkVisualizer activeAgent={activeAgent} processing={processing} />

      {/* Right Panel: Chat Interface */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-200 bg-white flex items-center px-6 shadow-sm z-10 justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Hospital System Navigator</h1>
            <p className="text-xs text-slate-500">Secure Delegation Hub v2.1</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             System Online
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 scrollbar-hide">
          <div className="max-w-3xl mx-auto">
             {messages.map((msg) => (
               <ChatBubble key={msg.id} message={msg} />
             ))}
             {processing && activeAgent === AgentType.NAVIGATOR && (
               <div className="flex justify-center text-xs text-slate-400 animate-pulse mt-4">
                 Validating Intent & Routing...
               </div>
             )}
              {processing && activeAgent && activeAgent !== AgentType.NAVIGATOR && (
               <div className="flex justify-start ml-12 text-xs text-slate-400 animate-pulse mt-4">
                 {AGENT_METADATA[activeAgent].name} is processing mandate...
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={processing ? "System is processing..." : "Describe your request (e.g., 'I need my blood test results')"}
              disabled={processing}
              className="w-full bg-slate-100 text-slate-800 rounded-xl pl-5 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={processing || !inputText.trim()}
              className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
           {error && (
            <div className="max-w-3xl mx-auto mt-2 flex items-center gap-2 text-xs text-red-500 justify-center">
              <AlertTriangle size={12} />
              {error}
            </div>
          )}
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400">
               Medical AI Delegation Hub. AI outputs are simulated for demonstration.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;