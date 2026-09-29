"use client";

import {
  matchLocationSuggestions,
  suggestionKindLabel,
  type LocationSuggestion,
  type SuggestionAddress,
} from "@/lib/location-suggestions";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export function LocationField({
  id,
  name,
  defaultValue = "",
  sources,
  listings = [],
  examples,
  onSelect,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  sources: readonly LocationSuggestion[];
  listings?: readonly SuggestionAddress[];
  examples?: string;
  onSelect?: (label: string) => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(
    () => matchLocationSuggestions(sources, value, listings, 8),
    [listings, sources, value],
  );

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function choose(label: string) {
    setValue(label);
    setOpen(false);
    onSelect?.(label);
  }

  const showList = open && suggestions.length > 0;

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="text-sm font-medium text-navy">
        Location
      </label>
      <input
        id={id}
        name={name}
        type="search"
        role="combobox"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="Town, city or postcode"
        value={value}
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList ? `${listId}-${activeIndex}` : undefined}
        className="field"
        onChange={(event) => {
          setValue(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && suggestions.length > 0) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index + 1) % suggestions.length);
          } else if (event.key === "ArrowUp" && suggestions.length > 0) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index - 1 + suggestions.length) % suggestions.length);
          } else if (event.key === "Enter" && showList && suggestions[activeIndex]) {
            event.preventDefault();
            choose(suggestions[activeIndex].label);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {examples ? <p className="mt-1.5 text-xs text-slate-500">{examples}</p> : null}
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Location suggestions"
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-md"
        >
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.kind}-${suggestion.label}`} role="presentation">
              <button
                type="button"
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm ${
                  index === activeIndex ? "bg-blue-50 text-navy" : "text-navy hover:bg-slate-50"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(suggestion.label)}
              >
                <span className="font-medium">{suggestion.label}</span>
                <span className="shrink-0 text-xs text-slate-500">{suggestionKindLabel(suggestion.kind)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
