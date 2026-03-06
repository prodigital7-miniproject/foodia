import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}

export function SearchBar({ placeholder = "지역명을 검색하세요", value, onChange, onSubmit }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 bg-white border-2 border-orange-400 rounded-2xl px-5 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-orange-100 transition-all">
      <Search className="w-5 h-5 text-orange-400 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
      />
      <button
        onClick={onSubmit}
        className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-1.5 rounded-xl transition-colors"
      >
        검색
      </button>
    </div>
  );
}