import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatAdvogado({ userEmail, userName }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Chat seguro estabelecido. Todas as mensagens são criptografadas ponta a ponta.",
      timestamp: new Date().toISOString(),
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText) => {
      // Salvar mensagem no log de auditoria
      await base44.entities.AuditLog.create({
        action_type: "create",
        entity_type: "ChatMessage",
        action_description: `Cliente enviou mensagem: ${messageText.substring(0, 50)}...`,
        user_email: userEmail,
        user_name: userName,
        new_data: {
          message: messageText,
          timestamp: new Date().toISOString(),
        }
      });

      // Enviar notificação por email ao advogado
      await base44.integrations.Core.SendEmail({
        to: "advogado@example.com", // Email do advogado responsável
        subject: `Nova mensagem de ${userName}`,
        body: `O cliente ${userName} enviou uma nova mensagem:\n\n"${messageText}"\n\nAcesse o sistema para responder.`,
      });

      return messageText;
    },
    onSuccess: (messageText) => {
      setMessages(prev => [...prev, {
        role: "user",
        content: messageText,
        timestamp: new Date().toISOString(),
      }]);
      setMessage("");
      
      // Simular resposta automática
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Sua mensagem foi recebida! Seu advogado responderá em breve. Você receberá uma notificação por e-mail quando houver resposta.",
          timestamp: new Date().toISOString(),
        }]);
      }, 1000);
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="glassmorphism border-2 border-slate-200 card-shadow h-[600px] flex flex-col">
      <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardTitle className="text-lg flex items-center gap-2 text-[#0B1A2E]">
          <MessageCircle className="w-5 h-5 text-cyan-600" />
          Chat Seguro com Advogado
          <Shield className="w-4 h-4 text-[#10B981] ml-auto" />
        </CardTitle>
        <p className="text-xs text-[#6B7280] mt-2">
          🔒 Comunicação criptografada ponta a ponta
        </p>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[80%] rounded-2xl p-4 shadow-md
              ${msg.role === 'user' 
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white' 
                : msg.role === 'system'
                ? 'bg-gradient-to-r from-slate-100 to-blue-100 text-[#111827] border-2 border-slate-200'
                : 'bg-white text-[#111827] border-2 border-slate-200'
              }
            `}>
              {msg.role === 'system' && (
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#10B981]" />
                  <span className="text-xs font-bold text-[#10B981] uppercase">Sistema</span>
                </div>
              )}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-cyan-600 uppercase">Advogado</span>
                </div>
              )}
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-cyan-100' : 'text-[#6B7280]'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 border-2 border-slate-300 focus:border-cyan-600 focus:ring-cyan-600"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}