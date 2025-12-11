import React from 'react';
import { AgentType } from '../types';
import { AGENT_METADATA } from '../constants';
import { ShieldAlert, BadgeDollarSign, FileText, CalendarCheck, Network } from 'lucide-react';

interface NetworkVisualizerProps {
  activeAgent: AgentType | null;
  processing: boolean;
}

const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({ activeAgent, processing }) => {
  const isNavigating = activeAgent === AgentType.NAVIGATOR && processing;
  
  const getIcon = (type: AgentType) => {
    switch (type) {
      case AgentType.MEDICAL_RECORDS: return <ShieldAlert size={20} />;
      case AgentType.BILLING_INSURANCE: return <BadgeDollarSign size={20} />;
      case AgentType.PATIENT_INFO: return <FileText size={20} />;
      case AgentType.APPOINTMENT_SCHEDULER: return <CalendarCheck size={20} />;
      default: return <Network size={20} />;
    }
  };

  const agents = [
    AgentType.MEDICAL_RECORDS,
    AgentType.BILLING_INSURANCE,
    AgentType.PATIENT_INFO,
    AgentType.APPOINTMENT_SCHEDULER
  ];

  return (
    <div className="w-full h-48 md:h-full md:w-80 bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-slate-700 p-6">
        
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="text-slate-400 text-xs font-mono absolute top-4 left-4 tracking-widest uppercase">
        System Status: <span className={processing ? "text-amber-400 animate-pulse" : "text-emerald-400"}>{processing ? "PROCESSING" : "IDLE"}</span>
      </div>

      {/* Central Navigator Node */}
      <div className="relative z-10 mb-8 md:mb-12 transition-all duration-500">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 
          ${isNavigating ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_30px_rgba(79,70,229,0.5)]' : 'bg-slate-800 border-slate-600'} 
          transition-all duration-300 z-20 relative`}>
          <Network size={32} className="text-white" />
        </div>
        {/* Pulsing effect when navigating */}
        {isNavigating && (
           <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-30 animate-ping"></div>
        )}
      </div>

      {/* Satellite Nodes */}
      <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-8 w-full justify-center">
        {agents.map((agent) => {
            const meta = AGENT_METADATA[agent];
            const isActive = activeAgent === agent;
            
            return (
                <div key={agent} className={`flex flex-col items-center gap-2 transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-60 scale-100'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors duration-300
                        ${isActive ? `${meta.color} border-white shadow-lg` : 'bg-slate-800 border-slate-700'}`}>
                        <div className="text-white">
                           {getIcon(agent)}
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase text-center w-20 leading-tight
                        ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {meta.name}
                    </span>
                    
                    {/* Connection Line (Visual Only - CSS Tricks) */}
                    {isActive && (
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-b from-indigo-500 to-transparent -z-10 hidden md:block"></div>
                    )}
                </div>
            )
        })}
      </div>

      {/* Connection lines from center to nodes (simplified visual) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-0 opacity-20">
         <line x1="50%" y1="30%" x2="25%" y2="70%" stroke="white" strokeWidth="1" />
         <line x1="50%" y1="30%" x2="75%" y2="70%" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default NetworkVisualizer;
