"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";

const DEBOUNCE_MS = 250;

interface SearchInputWithSuggestionsProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  /** 검색 결과 페이지에서 쓰일 때 true → 입력창 스타일을 SearchBar와 비슷하게 */
  variant?: "default" | "compact";
}

interface SuggestResponse {
  success: boolean;
  data?: { storeNames: string[]; foodSuggestions: { name: string; category: string | null }[] };
}

export function SearchInputWithSuggestions({
  placeholder = "음식점·음식 이름 검색",
  value,
  onChange,
  onSubmit,
  variant = "default",
}: SearchInputWithSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    storeNames: string[];
    foodSuggestions: { name: string; category: string | null }[];
  }>({ storeNames: [], foodSuggestions: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  /** 사용자가 직접 검색창에 포커스/입력했을 때만 추천 요청 (URL로 채워진 값만 있을 땐 미표시) */
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions({ storeNames: [], foodSuggestions: [] });
      setOpen(false);
      return;
    }
    if (!isSearching) {
      setOpen(false);
      return;
    }
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search/suggest?q=${encodeURIComponent(value.trim())}`)
        .then((r) => r.json())
        .then((res: SuggestResponse) => {
          if (res.success && res.data) {
            setSuggestions(res.data);
            setOpen(
              res.data.storeNames.length > 0 ||
                res.data.foodSuggestions.length > 0
            );
          } else {
            setSuggestions({ storeNames: [], foodSuggestions: [] });
            setOpen(false);
          }
        })
        .catch(() => {
          setSuggestions({ storeNames: [], foodSuggestions: [] });
          setOpen(false);
        })
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, isSearching]);

  /** 제출 시 리스트 닫고, 다음 포커스/입력 전까지 추천 안 뜨게 */
  const handleSubmit = useCallback(
    (query: string) => {
      setOpen(false);
      setIsSearching(false);
      onSubmit(query.trim());
    },
    [onSubmit]
  );

  const handleSelect = useCallback(
    (keyword: string) => {
      handleSubmit(keyword);
    },
    [handleSubmit]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSuggestions =
    suggestions.storeNames.length > 0 || suggestions.foodSuggestions.length > 0;

  // compact variant 부분만 교체 (return 위 variant === "compact" 블록)
if (variant === "compact") {
  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center gap-2 bg-white border-2 border-orange-300 rounded-2xl px-4 py-2.5 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
        <Search className="w-4 h-4 text-orange-400 shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => { setIsSearching(true); onChange(e.target.value); }}
          onFocus={() => setIsSearching(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(value)}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
        />
      </div>
      {/* 드롭다운 — 기존 유지 */}
      {open && (loading || hasSuggestions) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-gray-400">검색 중...</div>
          ) : (
            <>
              {suggestions.storeNames.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">식당</div>
                  {suggestions.storeNames.map((name, i) => (
                    <button key={`store-${i}`} type="button" onClick={() => handleSelect(name)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-orange-50 rounded-xl">
                      {name}
                    </button>
                  ))}
                </div>
              )}
              {suggestions.foodSuggestions.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">음식</div>
                  {suggestions.foodSuggestions.map((f, i) => (
                    <button key={`food-${i}`} type="button" onClick={() => handleSelect(f.name)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-orange-50 rounded-xl">
                      {f.name}
                      {f.category && <span className="text-gray-400 ml-1">({f.category})</span>}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center gap-2 bg-white border-2 border-orange-400 rounded-2xl px-5 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-orange-100 transition-all">
        <Search className="w-5 h-5 text-orange-400 shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setIsSearching(true);
            onChange(e.target.value);
          }}
          onFocus={() => setIsSearching(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(value)}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
        />
        <button
          type="button"
          onClick={() => handleSubmit(value)}
          className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-1.5 rounded-xl transition-colors"
        >
          검색
        </button>
      </div>
      {open && (loading || hasSuggestions) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">검색 중...</div>
          ) : (
            <>
              {suggestions.storeNames.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    식당
                  </div>
                  {suggestions.storeNames.map((name, i) => (
                    <button
                      key={`store-${i}`}
                      type="button"
                      onClick={() => handleSelect(name)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-orange-50 rounded-lg"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
              {suggestions.foodSuggestions.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    음식
                  </div>
                  {suggestions.foodSuggestions.map((f, i) => (
                    <button
                      key={`food-${i}`}
                      type="button"
                      onClick={() => handleSelect(f.name)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-orange-50 rounded-lg"
                    >
                      {f.name}
                      {f.category ? (
                        <span className="text-gray-400 ml-1">({f.category})</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
