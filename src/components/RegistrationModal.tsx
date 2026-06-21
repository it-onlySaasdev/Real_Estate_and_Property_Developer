import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FloatingInput } from "@/components/ui/FloatingInput";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialEmail?: string;
}

export function RegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  initialEmail = "",
}: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: initialEmail,
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (initialEmail && !formData.email) {
      setFormData((prev) => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "Please select a role";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        source: "registration",
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
        setErrors({});
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const animationClass = isMobile
    ? "animate-in slide-in-from-bottom duration-300 rounded-t-2xl"
    : "animate-in slide-in-from-right duration-300 rounded-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center">
      <div className={`relative w-full max-w-md bg-white p-6 shadow-2xl ${animationClass} sm:max-w-sm`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500">Save your estimates and find your dream home</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FloatingInput
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            name="fullName"
            error={errors.fullName}
            required
          />
          <FloatingInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            error={errors.email}
            required
          />
          <FloatingInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            error={errors.password}
            required
          />
          <FloatingInput
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            error={errors.confirmPassword}
            required
          />
          <FloatingInput
            label="I am a"
            value={formData.role}
            onChange={handleChange}
            name="role"
            error={errors.role}
            required
            isSelect
            options={["Buyer", "Agent", "Investor"]}
          />
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`mt-4 w-full rounded-md py-3 text-sm font-semibold text-white transition-all ${
              isSuccess
                ? "bg-green-500"
                : isSubmitting
                ? "bg-[#3ea4ff]/70 cursor-not-allowed"
                : "bg-[#3ea4ff] hover:bg-[#2a92ee]"
            }`}
          >
            {isSuccess ? "✅ Account Created!" : isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          By creating an account you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}