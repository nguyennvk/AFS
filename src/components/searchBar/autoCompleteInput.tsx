'use client';

import React, { useState, useEffect, useRef } from "react";

interface AutocompleteInputProps {
  suggestions: string[];
  placeholder?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  suggestions,
  placeholder = "Start typing...",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false); // Add state to check if we are on the client
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (isClient) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (isClient) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isClient]); // Run only when on the client side

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim() === "") {
      setFilteredSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const filtered = suggestions.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
    setHighlightedIndex(null); // Reset highlighted index when typing
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex === null || prevIndex === filteredSuggestions.length - 1
          ? 0
          : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex === null || prevIndex === 0
          ? filteredSuggestions.length - 1
          : prevIndex - 1
      );
    } else if (e.key === "Enter" && highlightedIndex !== null) {
      handleSelect(filteredSuggestions[highlightedIndex]);
    }
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    setShowDropdown(false);
    setHighlightedIndex(null); // Clear highlighted index
  };

  const handleClick = (value: string) => {
    handleSelect(value);
  };

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", // Ensure dropdown is positioned within this container
        width: "250px",
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}

      />
      {showDropdown && (
        <ul
          style={{
            position: "absolute",
            top: "100%", // Position the dropdown below the input field
            left: 0,
            right: 0,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 9999, // Ensure dropdown appears on top
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: adds a shadow for a more distinct dropdown
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleClick(suggestion)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                backgroundColor:
                  index === highlightedIndex ? "#e0e0e0" : "transparent", // Highlight active item
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
