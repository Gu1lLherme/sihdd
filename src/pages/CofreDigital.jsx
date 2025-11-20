import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, EyeOff, Plus, Lock, Mail, Key, Bitcoin, Instagram, Facebook } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
              <h1 className="text-2xl font-bold text-white mb-1">Digital Vault</h1>
              <p className="text-blue-100 text-sm">Secure storage for digital assets and credentials</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="border-2 border-[#4169E1] bg-blue-50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-[#4169E1]" />
              <div>
                <p className="font-bold text-[#333333]">End-to-end Encrypted Environment</p>
                <p className="text-sm text-[#AAAAAA]">
                  All data is encrypted using AES-256 and only accessible with your master password
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Master Password Input */}
        <Card className="border-2 border-slate-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="master-password">Master Password (required for viewing)</Label>
                <Input
                  id="master-password"
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter your master password"
                />
              </div>
              <Badge className="bg-green-100 text-green-700 border-0 whitespace-nowrap">
                {masterPassword ? "Unlocked" : "Locked"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Digital Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Asset Card */}
          <Dialog open={showNewAsset} onOpenChange={setShowNewAsset}>
            <DialogTrigger asChild>
              <Card className="border-2 border-dashed border-slate-300 cursor-pointer hover:border-[#4169E1] transition-colors">
                <CardContent className="p-8 flex flex-col items-center justify-center min-h-64">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="w-10 h-10 text-[#AAAAAA]" />
                  </div>
                  <p className="font-bold text-[#333333]">Add Digital Asset</p>
                  <p className="text-sm text-[#AAAAAA] text-center mt-2">
                    Store credentials, crypto keys, or social media access
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Digital Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Input id="platform" placeholder="e.g., Gmail, Instagram" />
                </div>
                <div>
                  <Label htmlFor="username">Username/Email</Label>
                  <Input id="username" placeholder="user@example.com" />
                </div>
                <div>
                  <Label htmlFor="password">Password/Seed Phrase</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input id="notes" placeholder="Additional information" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowNewAsset(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-[#4169E1] hover:bg-[#3151c7] text-white">
                    Save Asset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Existing Assets */}
          {ATIVOS_DIGITAIS_MOCK.map((asset) => {
            const Icon = asset.icon;
            const isRevealed = revealed[asset.id];

            return (
              <Card key={asset.id} className="border-2 border-slate-200">
                <CardHeader className="bg-slate-50 border-b-2 border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#4169E1] rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-[#333333]">{asset.platform}</CardTitle>
                      <Badge variant="outline" className="mt-1">{asset.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-xs text-[#AAAAAA] uppercase">Username/Email</Label>
                    <p className="font-bold text-[#333333] mt-1">{asset.username}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-[#AAAAAA] uppercase">Password/Key</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="flex-1 font-mono text-[#333333] bg-slate-100 px-3 py-2 rounded-lg">
                        {isRevealed ? "MySecurePassword123!" : asset.password}
                      </p>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleReveal(asset.id)}
                        className="flex-shrink-0"
                      >
                        {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-[#AAAAAA]">
                      Last accessed: <span className="font-bold text-[#333333]">Never</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}