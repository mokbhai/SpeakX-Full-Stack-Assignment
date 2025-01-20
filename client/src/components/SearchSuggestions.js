import React, { useState, useEffect, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { QuestionsService } from "../grpc/client";
import { QuestionType } from "../grpc/questions_pb";

function SearchSuggestions({ query, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query?.trim().length >= 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await QuestionsService.searchSuggestions(query);
      const suggestionsList = response.getSuggestionsList();
      setSuggestions(suggestionsList);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeName = (type) => {
    return Object.keys(QuestionType)[type] || "Unknown";
  };

  if (!showSuggestions || suggestions.length === 0) return null;

  return (
    <div
      ref={suggestionsRef}
      className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-secondary-200"
    >
      <ul className="py-1 max-h-60 overflow-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-secondary-50 cursor-pointer"
            onClick={() => {
              onSelect?.(suggestion.getTitle());
              setShowSuggestions(false);
              query = "";
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BiSearch className="h-4 w-4 text-secondary-400" />
                <span className="text-secondary-700">
                  {suggestion.getTitle()}
                </span>
              </div>
              <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded-full">
                {getQuestionTypeName(suggestion.getType())}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;
