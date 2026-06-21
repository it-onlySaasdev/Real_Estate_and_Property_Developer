import { Home, Mail, UserPlus, X } from "lucide-react";

interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onRegister: () => void;
  onGuest: () => void;
}

export function EstimateModal({ isOpen, onClose, email, onRegister, onGuest }: EstimateModalProps) {
  if (!isOpen) return null;

  const estimatedValue = "$425,000 - $450,000";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3ea4ff]/10">
            <Home className="h-6 w-6 text-[#3ea4ff]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Home Estimate</h2>
            <p className="text-sm text-gray-500">Based on recent sales in your area</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-[#f0f7ff] p-4 text-center">
          <p className="text-sm text-gray-600">Estimated Value</p>
          <p className="text-3xl font-bold text-[#1a2a3a]">{estimatedValue}</p>
          <p className="mt-1 text-xs text-gray-500">Updated: Today</p>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-md bg-gray-50 p-3">
          <Mail className="h-4 w-4 text-gray-400" />
          <p className="text-sm text-gray-600 truncate">{email}</p>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          Create a free account to save this estimate and get personalized property recommendations.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onRegister}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#3ea4ff] py-3 text-sm font-semibold text-white transition-all hover:bg-[#2a92ee]"
          >
            <UserPlus className="h-4 w-4" />
            Create Free Account
          </button>
          <button
            onClick={onGuest}
            className="flex flex-1 items-center justify-center rounded-md border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            Continue as Guest
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          By continuing you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}