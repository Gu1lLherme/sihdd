import React from "react";
import FormConjuges from "./FormConjuges";

export default function DadosIniciaisDivorcio({ formData, setFormData }) {
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormConjuges 
        data={formData} 
        onChange={handleChange} 
      />
    </div>
  );
}