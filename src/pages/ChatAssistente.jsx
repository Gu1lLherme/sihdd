import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Brain, Send, Sparkles, FileText, Calculator, BookOpen, Loader2 } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  { text: "Qual a alíquota do ITCMD em Sergipe?", icon: Calculator, category: "itcmd" },
  { text: "Como calcular o ITCMD de um inventário?", icon: Calculator, category: "calculo" },
  { text: "Quais documentos são necessários?", icon: FileText, category: "procedimentos" },
  { text: "Qual o prazo para pagamento?", icon: BookOpen, category: "prazo" },
];

export default function ChatAssistente() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Olá! Sou o **RAG Tributário SIHDD**, especializado em ITCMD de Sergipe.\n\nPosso ajudá-lo com:\n- 📊 Cálculos de ITCMD\n- 📋 Procedimentos\n- ⚖️ Legislação\n\nComo posso ajudar?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      // Optional: Auto-trigger send if you want immediate action
      // But setting state might be enough for user to just press enter
    }
  }, [searchParams]);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage) => {
      const prompt = `Você é um assistente jurídico especializado em ITCMD (Imposto sobre Transmissão Causa Mortis e Doação) do estado de Sergipe, Brasil, com conhecimento atualizado da legislação de 2020 a 2025.

Pergunta do usuário: ${userMessage}

Forneça uma resposta clara, profissional e precisa. Use markdown para formatar.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false,
      });

      await base44.entities.ChatMessage.create({
        user_email: user?.email || "unknown",
        message: userMessage,
        response: response,
        category: "itcmd"
      });

      return response;
    },
    onSuccess: (response) => {
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    },
    onError: () => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "❌ Erro ao processar. Tente novamente." 
      }]);
      setIsTyping(false);
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);
    chatMutation.mutate(userMessage);
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[75vh] min-h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mx-auto max-w-5xl">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-[#0B1A2E] via-[#1E40AF] to-[#3B82F6] p-3 sm:p-4 lg:p-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-white flex items-center gap-2 truncate">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                RAG Tributário
              </h1>
              <p className="text-blue-100 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1 truncate">
                ITCMD/SE 2020-2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Questions - Mobile Scrollable */}
      {messages.length === 1 && (
        <div className="bg-white border-b border-slate-200 p-3 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] mb-2 sm:mb-3 uppercase tracking-wider">
              Perguntas Sugeridas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {SUGGESTED_QUESTIONS.map((q, i) => {
                const Icon = q.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(q.text)}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg sm:rounded-xl border-2 border-[#3B82F6]/20 hover:border-[#1E40AF] transition-all duration-300 text-left group"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#111827] line-clamp-2">{q.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Messages - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`
                max-w-[90%] sm:max-w-[85%] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg
                ${message.role === "user" 
                  ? "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white" 
                  : "glassmorphism border border-slate-200 text-[#111827]"
                }
              `}>
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                    <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-[#1E40AF]" />
                    <span className="text-[10px] sm:text-xs font-bold text-[#1E40AF] uppercase tracking-wider">
                      RAG
                    </span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none text-xs sm:text-sm">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('- ')) {
                      return (
                        <div key={i} className="flex items-start gap-2 my-1">
                          <span className="text-[#3B82F6] mt-0.5">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={i} className="my-1.5 sm:my-2">
                          {parts.map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      );
                    }
                    return line ? <p key={i} className="my-1.5 sm:my-2">{line}</p> : <br key={i} />;
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="glassmorphism border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E40AF] animate-spin" />
                  <span className="text-xs sm:text-sm text-[#6B7280] font-medium">
                    Analisando...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Mobile Optimized */}
      <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 sm:gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              className="flex-1 border-2 border-slate-300 focus:border-[#1E40AF] focus:ring-[#1E40AF] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#111827]"
              disabled={chatMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {chatMutation.isPending ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}