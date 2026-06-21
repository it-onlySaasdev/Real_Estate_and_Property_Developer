import { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal";
import { FloatingInput } from "@/components/ui/FloatingInput";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function SignInModal({ isOpen, onClose, onSubmit }: SignInModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
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
        source: "signin",
        ...formData,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          email: "",
          password: "",
        });
        setErrors({});
      }, 2000);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Sign In">
      <form onSubmit={handleSubmit}>
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
          {isSuccess ? " Signed In!" : isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </BaseModal>
  );
}