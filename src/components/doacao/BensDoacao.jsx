import React from "react";
import ListaBensDoacao from "./ListaBensDoacao";

export default function BensDoacao({ formData, setFormData }) {
  const handleAddBem = (bem) => {
    const novosBens = [...(formData.bens || []), bem];
    setFormData({ ...formData, bens: novosBens });
  };

  const handleRemoveBem = (index) => {
    const novosBens = (formData.bens || []).filter((_, i) => i !== index);
    setFormData({ ...formData, bens: novosBens });
  };

  return (
    <ListaBensDoacao
      bens={formData.bens || []}
      onAddBem={handleAddBem}
      onRemoveBem={handleRemoveBem}
    />
  );
}