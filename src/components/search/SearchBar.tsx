import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}

export function SearchBar({ placeholder = "지역명을 검색하세요", value, onChange, onSubmit }: SearchBarProps) {
  return (
    <div className="relative">
    <Search 
  className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900" 
  size={20} 
  strokeWidth={2} 
/>
      <input
  type="text"
  placeholder={placeholder}
  value={value}
  onChange={(e) => onChange?.(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
  className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-gray-900 placeholder:text-gray-500  
             border-2 border-amber-900" 
/>
    </div>
  );
}
