import React, { useState } from "react";
import { Shield, Mail, Bitcoin, Instagram, Facebook } from "lucide-react";

// Imported components
import ControleAcesso from "@/components/cofre/ControleAcesso";
import GridAtivos from "@/components/cofre/GridAtivos";

const ATIVOS_DIGITAIS_MOCK = [
  { id: 1, platform: "Gmail", icon: Mail, username: "estate@email.com", password: "••••••••", type: "email" },
  { id: 2, platform: "Crypto Wallet", icon: Bitcoin, username: "Cold Wallet", password: "••••••••••••••••••••", type: "crypto" },
  { id: 3, platform: "Instagram", icon: Instagram, username: "@estateperson", password: "••••••••", type: "social" },
  { id: 4, platform: "Facebook", icon: Facebook, username: "estateperson@email.com", password: "••••••••", type: "social" },
];

export default function CofreDigital() {
  const [revealed, setRevealed] = useState({});
  const [masterPassword, setMasterPassword] = useState("");
  const [showNewAsset, setShowNewAsset] = useState(false);

  const handleReveal = (id) => {
    // Simular verificação de senha mestra
    if (masterPassword === "admin123") {
      setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
    } else {
      alert("Incorrect master password!");
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4169E1] via-[#5a7bea] to-[#4169E1] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Cofre Digital</h1>
              <p className="text-blue-100 text-sm">Armazenamento seguro para ativos digitais e credenciais</p>
            </div>
          </div>
        </div>

        <ControleAcesso 
          masterPassword={masterPassword}
          setMasterPassword={setMasterPassword}
        />

        <GridAtivos 
          ATIVOS_DIGITAIS_MOCK={ATIVOS_DIGITAIS_MOCK}
          revealed={revealed}
          handleReveal={handleReveal}
          showNewAsset={showNewAsset}
          setShowNewAsset={setShowNewAsset}
        />
      </div>
    </div>
  );
}