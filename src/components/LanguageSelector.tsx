import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

export default function LanguageSelector({
  setLanguage,
}: {
  setLanguage: (lang: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (lang: string) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow"
      >
        <Globe className="w-4 h-4 text-blue-600" />
        Choose Language
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg">
          <button
            onClick={() => handleSelect("en")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            English
          </button>

          <button
            onClick={() => handleSelect("fr")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Français
          </button>
        </div>
      )}
    </div>
  );
}