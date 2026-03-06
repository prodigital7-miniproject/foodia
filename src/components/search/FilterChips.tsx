interface FilterChipsProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function FilterChips({ options, selected, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selected === option
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}