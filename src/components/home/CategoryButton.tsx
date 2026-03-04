interface CategoryButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export function CategoryButton({ icon, label, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all"
    >
      <div className="text-3xl">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
