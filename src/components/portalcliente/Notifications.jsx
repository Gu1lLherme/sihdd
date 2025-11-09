import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, AlertCircle, Info, FileText } from "lucide-react";
import { motion } from "framer-motion";

const getActionIcon = (actionType) => {
  const icons = {
    create: CheckCircle2,
    update: Info,
    view: FileText,
    export: FileText,
  };
  return icons[actionType] || AlertCircle;
};

const getActionColor = (actionType) => {
  const colors = {
    create: 'bg-[#10B981] text-white',
    update: 'bg-[#3B82F6] text-white',
    view: 'bg-[#6B7280] text-white',
    export: 'bg-[#F59E0B] text-white',
  };
  return colors[actionType] || 'bg-slate-500 text-white';
};

export default function Notifications({ notifications }) {
  if (notifications.length === 0) {
    return (
      <Card className="glassmorphism border border-slate-200 card-shadow">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-[#F59E0B]" />
          </div>
          <h3 className="text-xl font-semibold text-[#111827] mb-2">
            Nenhuma notificação
          </h3>
          <p className="text-[#6B7280]">
            Você será notificado aqui sobre atualizações importantes nos seus casos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => {
        const Icon = getActionIcon(notification.action_type);
        const colorClass = getActionColor(notification.action_type);

        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glassmorphism border-2 border-slate-200 card-shadow-hover group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-[#111827]">
                        {notification.action_description}
                      </h4>
                      <Badge className={`${colorClass} font-semibold text-xs`}>
                        {notification.action_type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-[#6B7280]">
                      <p>
                        <strong>Tipo:</strong> {notification.entity_type}
                      </p>
                      <p>
                        <strong>Data:</strong> {new Date(notification.created_date).toLocaleString('pt-BR')}
                      </p>
                      {notification.user_name && (
                        <p>
                          <strong>Por:</strong> {notification.user_name}
                        </p>
                      )}
                    </div>

                    {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider mb-1">
                          Detalhes
                        </p>
                        <pre className="text-xs text-[#111827] overflow-x-auto">
                          {JSON.stringify(notification.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}