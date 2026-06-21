import { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal";
import { FloatingInput } from "@/components/ui/FloatingInput";

interface ForAgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ForAgentsModal({ isOpen, onClose, onSubmit }: ForAgentsModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    experience: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    if (!formData.experience) newErrors.experience = "Please select your experience level";
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
        source: "for_agents",
        ...formData,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          licenseNumber: "",
          experience: "",
        });
        setErrors({});
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
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

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Join as an Agent">
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
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          name="phone"
          error={errors.phone}
          required
        />
        <FloatingInput
          label="License Number"
          type="text"
          value={formData.licenseNumber}
          onChange={handleChange}
          name="licenseNumber"
          error={errors.licenseNumber}
          required
          placeholder="e.g., RE-12345"
        />
        <FloatingInput
          label="Experience Level"
          value={formData.experience}
          onChange={handleChange}
          name="experience"
          error={errors.experience}
          required
          isSelect
          options={["0-1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"]}
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
          {isSuccess ? " Submitted!" : isSubmitting ? "Submitting..." : "Apply as Agent"}
        </button>
      </form>
    </BaseModal>
  );
}