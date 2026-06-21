import { X } from "lucide-react";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileMenu({ isOpen, onClose, children }: MobileMenuProps) {
  useEffect(() => {
    // Handle ESC key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Lock body scroll when menu is open
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-200 md:hidden">
      {/* Backdrop overlay - NO close on click */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dropdown menu - from top */}
      <div className="relative h-full w-full bg-[#1a2a3a] p-6 animate-in slide-in-from-top duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="mb-8 pt-2">
          <span className="text-2xl font-semibold text-white">Menu</span>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-6 text-white">
          {children}
        </nav>
      </div>
    </div>
  );
}