import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2, ThumbsUp, ThumbsDown, BookOpen, Calculator, Clock, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_QUESTIONS = [
  { text: "Como calcular o ITCMD em Sergipe?", icon: Calculator, category: "calculo" },
  { text: "Qual o prazo para pagamento do ITCMD?", icon: Clock, category: "prazo" },
  { text: "Quais documentos necessários para inventário?", icon: BookOpen, category: "procedimentos" },
  { text: "Como funciona a partilha com viúva meeira?", icon: Scale, category: "legislacao" },
];

export default function ChatAssistente() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o Assistente Virtual do SIHDD, especialista em direito sucessório e ITCMD. Como posso ajudá-lo hoje?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (question) => {
      const prompt = `Você é um assistente virtual especializado em direito sucessório brasileiro, especialmente em inventários e ITCMD (Imposto de Transmissão Causa Mortis e Doação) no estado de Sergipe.

Seu papel é:
- Orientar advogados sobre procedimentos de inventário
- Explicar cálculos de ITCMD (alíquota de 4% em Sergipe)
- Esclarecer sobre prazos e legislação
- Ajudar com questões sobre partilha de bens
- Orientar sobre documentação necessária

Responda de forma clara, profissional e objetiva. Se a pergunta for sobre legislação específica, cite os artigos quando aplicável.

Pergunta do usuário: ${question}

Forneça uma resposta completa e útil:`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false,
      });

      return response;
    },
    onSuccess: (response, question) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
      setIsTyping(false);

      // Salvar no histórico
      base44.entities.ChatMessage.create({
        user_email: user?.email || "unknown",
        message: question,
        response: response,
        category: "geral",
      });
    },
    onError: () => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.",
        timestamp: new Date(),
        error: true,
      }]);
      setIsTyping(false);
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    sendMessageMutation.mutate(input);
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
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 1 && (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-slate-600 font-medium">Perguntas frequentes:</p>
            <div className="grid grid-cols-1 gap-2">
              {SUGGESTED_QUESTIONS.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(q.text)}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left text-sm"
                >
                  <q.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-700">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white'
                  : message.error
                  ? 'bg-red-50 border border-red-200 text-red-900'
                  : 'bg-white border border-slate-200 text-slate-900'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Scale className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-blue-900">Assistente SIHDD</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-slate-600">Digitando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre inventários..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-900 hover:bg-blue-800"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          💡 Dica: Seja específico em suas perguntas para respostas mais precisas
        </p>
      </div>
    </div>
  );
}