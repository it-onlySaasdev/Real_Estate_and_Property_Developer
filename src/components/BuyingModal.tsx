import { useState } from "react";
import { BaseModal } from "@/components/ui/BaseModal";
import { FloatingInput } from "@/components/ui/FloatingInput";

interface BuyingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function BuyingModal({ isOpen, onClose, onSubmit }: BuyingModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    budgetRange: "",
    propertyType: "",
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
    if (!formData.budgetRange) newErrors.budgetRange = "Please select a budget range";
    if (!formData.propertyType) newErrors.propertyType = "Please select a property type";
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
        source: "buying",
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
          budgetRange: "",
          propertyType: "",
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
    <BaseModal isOpen={isOpen} onClose={onClose} title="Tell Us What You're Looking For">
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
          label="Budget Range"
          value={formData.budgetRange}
          onChange={handleChange}
          name="budgetRange"
          error={errors.budgetRange}
          required
          isSelect
          options={["$100k-$250k", "$250k-$500k", "$500k-$1M", "$1M+"]}
        />
        <FloatingInput
          label="Property Type"
          value={formData.propertyType}
          onChange={handleChange}
          name="propertyType"
          error={errors.propertyType}
          required
          isSelect
          options={["House", "Condo", "Townhouse", "Land"]}
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
          {isSuccess ? "✅ Submitted!" : isSubmitting ? "Submitting..." : "Find My Dream Home"}
        </button>
      </form>
    </BaseModal>
  );
}