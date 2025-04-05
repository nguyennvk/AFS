"use client";
import React from "react";
import AutocompleteInput from "../../components/searchBar/autoCompleteInput";

const T: React.FC = () => {
  const fruitSuggestions = [
    "Apple",
    "Banana",
    "Cherry",
    "Grapes",
    "Mango",
    "Orange",
    "Strawberry",
  ];


  return (
    <div style={{ padding: "50px" }}>
      <h2>Autocomplete Example</h2>
      <AutocompleteInput
        suggestions={fruitSuggestions}
        placeholder="Choose a fruit..."
      />
    </div>
  );
};

export default T;
