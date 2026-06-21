import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle ESC key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Lock body scroll when modal is open
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidth} mx-4 rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200`}
      >
        {/* Close Button - X icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">{title}</h2>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}