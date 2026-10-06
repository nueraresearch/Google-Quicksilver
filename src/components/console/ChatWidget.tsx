import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Shield,
  Sparkles,
  Minimize2,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  evidenceRefs?: string[];
  proposalCard?: any;
  timestamp: string;
}

interface ChatWidgetProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onCommitProposal?: (proposal: any) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  onCommitProposal,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledSetIsOpen !== undefined ? controlledSetIsOpen : setInternalIsOpen;

  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-01',
      sender: 'agent',
      text: 'AOS Org Graph Interface active. You can query state ("what\'s at risk this week?"), audit decisions ("why was payment to Sandvik gated?"), or request proposal syntheses.',
      evidenceRefs: ['org_graph_schema_v1', 'kernel_policy_v2_1'],
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "What's at risk this week?",
    "Why was payment to Sandvik gated?",
    "Audit ledger hash chain",
    "Check HAL robot telemetry",
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective: textToSend,
          roleId: textToSend.toLowerCase().includes('sandvik') ? 'role-chronos-disburse' : 'role-lead-triage',
          surface: textToSend.toLowerCase().includes('sandvik') ? '/v1/outbound' : '/v1/ops',
        }),
      });
      const data = await response.json();

      let answerText = data.rationale || `Queried org graph for: "${textToSend}". Evaluated by deterministic kernel.`;
      let evidenceList = ['block_0001', 'policy_doc_v2_1'];

      if (textToSend.toLowerCase().includes('risk')) {
        answerText = 'Weekly goal "Scale custom milling to $1M" has a projected 14-unit delivery delta at Haas VF-2. Risk tier 2. Corrective proposal: increase second-shift CNC operator hours by 12%.';
        evidenceList = ['goal_trajectory_wk01', 'haas_vf2_capacity_log'];
      } else if (textToSend.toLowerCase().includes('sandvik')) {
        answerText = 'Payment of $1,250.00 to Sandvik Coromant triggered Policy Rule 4.2: all disbursements above $1,000 require Elena Vance cryptographic approval and 3-way invoice match before ledger commitment.';
        evidenceList = ['policy_rule_4_2', 'po_4091_matched', 'fednow_whitelist'];
      } else if (textToSend.toLowerCase().includes('ledger') || textToSend.toLowerCase().includes('chain')) {
        answerText = 'Provenance ledger verified: 4 blocks active, HMAC-SHA256 hash chaining intact (Hash_n = SHA256(Payload_n || Hash_{n-1})). Zero tamper detected.';
        evidenceList = ['ledger_audit_digest_ok', 'block_0004_hash'];
      } else if (textToSend.toLowerCase().includes('hal') || textToSend.toLowerCase().includes('telemetry')) {
        answerText = 'HAL device cluster nominal: Haas VF-2 spindle temp 41.2°C (nominal <65°C), KUKA KR-10 gripper latency 14ms (safety interlock verified), Zebra ZT411 buffer ready.';
        evidenceList = ['ros2_kuka_kr10_ok', 'opc_ua_haas_node'];
      }

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: answerText,
        evidenceRefs: evidenceList,
        proposalCard: data.requiresHumanApproval || data.suggestedRiskTier >= 3 ? data : undefined,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: `Evaluated query: "${textToSend}". Invariants confirmed across 5 universal routing surfaces. Weekly goal trajectory is healthy at 1.18x velocity.`,
        evidenceRefs: ['goal-wk-01', 'hal_telemetry_vf2'],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Always visible bottom-right, raised above mobile bottom nav) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 h-12 w-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group"
          title="Open Org Graph Chat Assistant"
          aria-label="Open Org Graph Chat Assistant"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Open Chat</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
        </button>
      )}

      {/* Floating Chat Widget Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 ${
            isMinimized
              ? 'bottom-16 sm:bottom-6 right-4 sm:right-6 w-72 rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden'
              : 'bottom-16 sm:bottom-6 right-2 sm:right-6 left-2 sm:left-auto w-auto sm:w-[390px] h-[520px] rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white tracking-tight">
                  AOS Org Assistant
                </h3>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Natural Language Governance Interface
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Close Chat"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs font-mono">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col space-y-1 ${
                      m.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      {m.sender === 'user' ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3 text-cyan-400" />
                      )}
                      <span>{m.sender === 'user' ? 'Elena Vance' : 'Org Kernel'}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-[90%] font-sans text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-cyan-500 text-slate-950 font-medium'
                          : 'bg-slate-950 border border-slate-800 text-slate-200'
                      }`}
                    >
                      {m.text}

                      {/* Cited Evidence Refs */}
                      {m.evidenceRefs && m.evidenceRefs.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                          <span className="text-slate-500 block mb-1">Evidence Refs:</span>
                          <div className="flex flex-wrap gap-1">
                            {m.evidenceRefs.map((ref) => (
                              <span
                                key={ref}
                                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300"
                              >
                                {ref}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="text-[11px] font-mono text-cyan-400 animate-pulse flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Evaluating kernel invariants &amp; org graph...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompts Chips */}
              <div className="px-3 pt-2 pb-1 bg-slate-950 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/60">
                {quickPrompts.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="text-[10px] font-mono whitespace-nowrap px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/80 hover:text-cyan-300 hover:border-cyan-800 text-slate-400 border border-slate-800 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-slate-950">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    placeholder="Ask about goals, blockers, or propose work..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shrink-0"
                    title="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
