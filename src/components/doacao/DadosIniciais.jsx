import React from "react";
import FormDoador from "./FormDoador";
import FormDonatario from "./FormDonatario";

export default function DadosIniciais({ formData, setFormData }) {
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormDoador 
        data={formData} 
        onChange={handleChange} 
      />
      <FormDonatario 
        data={formData} 
        onChange={handleChange} 
      />
    </div>
  );
}