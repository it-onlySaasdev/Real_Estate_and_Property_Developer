import { createFileRoute } from "@tanstack/react-router";
import { Home, MapPin, Menu } from "lucide-react";
import { useState } from "react";
import heroHome from "@/assets/hero-home.jpg";
import { SellingModal } from "@/components/SellingModal";
import { BuyingModal } from "@/components/BuyingModal";
import { EstimateModal } from "@/components/EstimateModal";
import { RegistrationModal } from "@/components/RegistrationModal";
import { ForAgentsModal } from "@/components/ForAgentsModal";
import { SignInModal } from "@/components/SignInModal";
import { MobileMenu } from "@/components/MobileMenu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HProperties — Find out what your home is really worth" },
      {
        name: "description",
        content:
          "Get a real-world home value estimate in less than 2 minutes with HProperties Home Estimates.",
      },
      { property: "og:title", content: "HProperties — Home Estimates" },
      {
        property: "og:description",
        content: "Find out what your home is really worth in under 2 minutes.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeTab, setActiveTab] = useState<"Selling" | "Buying" | "Home Estimates">("Home Estimates");
  const [address, setAddress] = useState("");
  
  // Modal states
  const [showSellingModal, setShowSellingModal] = useState(false);
  const [showBuyingModal, setShowBuyingModal] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showForAgentsModal, setShowForAgentsModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [estimateEmail, setEstimateEmail] = useState("");
  const [isSubmittingEstimate, setIsSubmittingEstimate] = useState(false);

  // Handler for all lead submissions (Selling, Buying, Estimate, ForAgents, SignIn)
  const handleLeadSubmit = async (data: any) => {
    try {
      // Replace with your actual Make.com webhook URL
      const response = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit lead");
      }
      
      return response;
    } catch (error) {
      console.error("Lead submission error:", error);
      throw error;
    }
  };

  // Handler for registration submission
  const handleRegistrationSubmit = async (data: any) => {
    try {
      // Replace with your actual Make.com webhook URL for registrations
      const response = await fetch("YOUR_MAKE_WEBHOOK_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Handler for Estimate form submission
  const handleEstimateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      alert("Please enter a valid email address");
      return;
    }
    
    setIsSubmittingEstimate(true);
    try {
      setEstimateEmail(address);
      setShowEstimateModal(true);
    } catch (error) {
      console.error("Estimate error:", error);
    } finally {
      setIsSubmittingEstimate(false);
    }
  };

  // Handler for Estimate Modal - Guest mode
  const handleGuestSubmit = async () => {
    try {
      await handleLeadSubmit({
        source: "estimate",
        email: estimateEmail,
        status: "guest",
      });
      setShowEstimateModal(false);
    } catch (error) {
      console.error("Guest submission error:", error);
    }
  };

  // Handler for Estimate Modal - Register mode
  const handleRegisterFromEstimate = () => {
    setShowEstimateModal(false);
    setShowRegistrationModal(true);
  };

  // Tab click handlers
  const handleTabClick = (tab: "Selling" | "Buying" | "Home Estimates") => {
    if (tab === "Selling") {
      setShowSellingModal(true);
    } else if (tab === "Buying") {
      setShowBuyingModal(true);
    } else {
      setActiveTab("Home Estimates");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#1a2a3a]">
      {/* Hero background */}
      <img
        src={heroHome}
        alt="Modern home at twilight"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <a href="/" className="flex items-center gap-2 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3ea4ff]">
            <Home className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold tracking-tight">HProperties</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm text-white md:flex md:gap-10 md:text-[15px]">
          <a href="#" className="hover:opacity-80">About Us</a>
          <button 
            onClick={() => setShowForAgentsModal(true)}
            className="hover:opacity-80 cursor-pointer bg-transparent border-none text-white text-sm md:text-[15px]"
          >
            For Agents
          </button>
          <button 
            onClick={() => setShowSignInModal(true)}
            className="hover:opacity-80 cursor-pointer bg-transparent border-none text-white text-sm md:text-[15px]"
          >
            Sign In
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="block text-white hover:opacity-80 transition-opacity md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Hero content */}
      <main className="relative z-10 px-6 pt-8 md:px-24 md:pt-12">
        <div className="max-w-2xl">
          {/* Tabs */}
          <div className="flex items-center gap-10 text-[15px] text-white">
            <button
              onClick={() => handleTabClick("Selling")}
              className={`relative pb-2 transition ${
                activeTab === "Selling" ? "font-medium" : "opacity-90 hover:opacity-100"
              }`}
            >
              Selling
              {activeTab === "Selling" && (
                <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-white" />
              )}
            </button>
            <button
              onClick={() => handleTabClick("Buying")}
              className={`relative pb-2 transition ${
                activeTab === "Buying" ? "font-medium" : "opacity-90 hover:opacity-100"
              }`}
            >
              Buying
              {activeTab === "Buying" && (
                <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-white" />
              )}
            </button>
            <button
              onClick={() => handleTabClick("Home Estimates")}
              className={`relative pb-2 transition ${
                activeTab === "Home Estimates" ? "font-medium" : "opacity-90 hover:opacity-100"
              }`}
            >
              Home Estimates
              {activeTab === "Home Estimates" && (
                <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-white" />
              )}
            </button>
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-4xl font-bold leading-tight text-white md:text-[44px] md:leading-[1.15]">
            Find out what your home
            <br />
            is really worth
          </h1>

          {/* Search bar */}
          <form
            onSubmit={handleEstimateSubmit}
            className="mt-6 flex w-full max-w-xl items-center gap-2 rounded-md bg-white p-2 shadow-2xl"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent py-2 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingEstimate}
              className="rounded-md bg-[#3ea4ff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a92ee] disabled:opacity-70"
            >
              {isSubmittingEstimate ? "Processing..." : "Get estimate"}
            </button>
          </form>

          <p className="mt-4 text-sm text-white/85">
            Get a real-world home value estimate in less than 2 minutes.
          </p>
        </div>
      </main>

      {/* Bottom-left tag */}
      <div className="absolute bottom-6 left-6 z-10 text-sm text-white md:left-12">
        Introducing Simple Sale<sup className="text-[10px]">℠</sup> by HProperties -{" "}
        <a href="#" className="text-[#7bc4ff] hover:underline">Learn more »</a>
      </div>

      {/* Bottom-right notification */}
      <div className="absolute bottom-6 right-6 z-10 flex max-w-xs items-start gap-3 rounded-md bg-white p-3 shadow-xl md:right-12">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#3ea4ff]">
          <Home className="h-4 w-4 text-white" />
        </div>
        <div className="text-[13px] leading-snug text-gray-800">
          <p>
            <span className="font-semibold">Brenda W.</span> from{" "}
            <span className="font-semibold">Atlanta, Georgia</span>
          </p>
          <p className="text-gray-600">just sold a home using HProperties</p>
          <p className="mt-0.5 text-xs text-gray-400">4 hours ago</p>
        </div>
      </div>

      {/* Modals */}
      <SellingModal
        isOpen={showSellingModal}
        onClose={() => setShowSellingModal(false)}
        onSubmit={handleLeadSubmit}
      />

      <BuyingModal
        isOpen={showBuyingModal}
        onClose={() => setShowBuyingModal(false)}
        onSubmit={handleLeadSubmit}
      />

      <EstimateModal
        isOpen={showEstimateModal}
        onClose={() => setShowEstimateModal(false)}
        email={estimateEmail}
        onRegister={handleRegisterFromEstimate}
        onGuest={handleGuestSubmit}
      />

      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmit={handleRegistrationSubmit}
        initialEmail={estimateEmail}
      />

      <ForAgentsModal
        isOpen={showForAgentsModal}
        onClose={() => setShowForAgentsModal(false)}
        onSubmit={handleLeadSubmit}
      />

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSubmit={handleLeadSubmit}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <button
          onClick={() => {
            handleTabClick("Selling");
            setIsMobileMenuOpen(false);
          }}
          className="text-left text-xl font-medium hover:opacity-80 transition-opacity"
        >
          Selling
        </button>
        <button
          onClick={() => {
            handleTabClick("Buying");
            setIsMobileMenuOpen(false);
          }}
          className="text-left text-xl font-medium hover:opacity-80 transition-opacity"
        >
          Buying
        </button>
        <button
          onClick={() => {
            handleTabClick("Home Estimates");
            setIsMobileMenuOpen(false);
          }}
          className="text-left text-xl font-medium hover:opacity-80 transition-opacity"
        >
          Home Estimates
        </button>
        <div className="h-px bg-white/20 my-2" />
        <a
          href="#"
          className="text-left text-xl font-medium hover:opacity-80 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          About Us
        </a>
        <button
          onClick={() => {
            setShowForAgentsModal(true);
            setIsMobileMenuOpen(false);
          }}
          className="text-left text-xl font-medium hover:opacity-80 transition-opacity"
        >
          For Agents
        </button>
        <button
          onClick={() => {
            setShowSignInModal(true);
            setIsMobileMenuOpen(false);
          }}
          className="text-left text-xl font-medium hover:opacity-80 transition-opacity"
        >
          Sign In
        </button>
      </MobileMenu>
    </div>
  );
}