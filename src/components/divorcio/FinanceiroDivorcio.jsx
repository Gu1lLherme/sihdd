import React from "react";
import DadosFinanceiros from "./DadosFinanceiros";

export default function FinanceiroDivorcio({ formData, setFormData }) {
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="space-y-6">
      <DadosFinanceiros 
        data={formData} 
        onChange={handleChange} 
      />
    </div>
  );
}