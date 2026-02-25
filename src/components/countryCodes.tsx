// countryCodes.ts
// Full country list with dial code, name, and CDN flag image
// Import with:  import countryCodes from "./countryCodes";

export interface CountryCode {
  code: string;
  country: string;
  flag: string; // image URL
}

const countryCodes: CountryCode[] = [
  { code: "+213", country: "Algeria", flag: "https://flagsapi.com/DZ/flat/64.png" },
  { code: "+244", country: "Angola", flag: "https://flagsapi.com/AO/flat/64.png" },
  { code: "+225", country: "Côte d'Ivoire", flag: "https://flagsapi.com/CI/flat/64.png" },
  { code: "+226", country: "Burkina Faso", flag: "https://flagsapi.com/BF/flat/64.png" },
  { code: "+257", country: "Burundi", flag: "https://flagsapi.com/BI/flat/64.png" },
  { code: "+237", country: "Cameroon", flag: "https://flagsapi.com/CM/flat/64.png" },
  { code: "+238", country: "Cape Verde", flag: "https://flagsapi.com/CV/flat/64.png" },
  { code: "+236", country: "Central African Republic", flag: "https://flagsapi.com/CF/flat/64.png" },
  { code: "+242", country: "Republic of the Congo", flag: "https://flagsapi.com/CG/flat/64.png" },
  { code: "+243", country: "Democratic Republic of the Congo", flag: "https://flagsapi.com/CD/flat/64.png" },
  { code: "+253", country: "Djibouti", flag: "https://flagsapi.com/DJ/flat/64.png" },
  { code: "+240", country: "Equatorial Guinea", flag: "https://flagsapi.com/GQ/flat/64.png" },
  { code: "+291", country: "Eritrea", flag: "https://flagsapi.com/ER/flat/64.png" },
  { code: "+251", country: "Ethiopia", flag: "https://flagsapi.com/ET/flat/64.png" },
  { code: "+218", country: "Libya", flag: "https://flagsapi.com/LY/flat/64.png" },
  { code: "+232", country: "Sierra Leone", flag: "https://flagsapi.com/SL/flat/64.png" },
  { code: "+249", country: "Sudan", flag: "https://flagsapi.com/SD/flat/64.png" },
  { code: "+211", country: "South Sudan", flag: "https://flagsapi.com/SS/flat/64.png" },
  { code: "+27", country: "South Africa", flag: "https://flagsapi.com/ZA/flat/64.png" },
  { code: "+260", country: "Zambia", flag: "https://flagsapi.com/ZM/flat/64.png" },
  { code: "+263", country: "Zimbabwe", flag: "https://flagsapi.com/ZW/flat/64.png" },
  { code: "+265", country: "Malawi", flag: "https://flagsapi.com/MW/flat/64.png" },
  { code: "+265", country: "Malawi", flag: "https://flagsapi.com/MW/flat/64.png" },
  { code: "+223", country: "Mali", flag: "https://flagsapi.com/ML/flat/64.png" },
  { code: "+230", country: "Mauritius", flag: "https://flagsapi.com/MU/flat/64.png" },
  { code: "+222", country: "Mauritania", flag: "https://flagsapi.com/MR/flat/64.png" },
  { code: "+212", country: "Morocco", flag: "https://flagsapi.com/MA/flat/64.png" },
  { code: "+258", country: "Mozambique", flag: "https://flagsapi.com/MZ/flat/64.png" },
  { code: "+261", country: "Madagascar", flag: "https://flagsapi.com/MG/flat/64.png" },
  { code: "+265", country: "Malawi", flag: "https://flagsapi.com/MW/flat/64.png" },
  { code: "+266", country: "Lesotho", flag: "https://flagsapi.com/LS/flat/64.png" },
  { code: "+269", country: "Comoros", flag: "https://flagsapi.com/KM/flat/64.png" },
  { code: "+20", country: "Egypt", flag: "https://flagsapi.com/EG/flat/64.png" },
  { code: "+240", country: "Equatorial Guinea", flag: "https://flagsapi.com/GQ/flat/64.png" },
  { code: "+291", country: "Eritrea", flag: "https://flagsapi.com/ER/flat/64.png" },
  { code: "+34", country: "Western Sahara", flag: "https://flagsapi.com/EH/flat/64.png" },
  { code: "+251", country: "Ethiopia", flag: "https://flagsapi.com/ET/flat/64.png" },
  { code: "+233", country: "Ghana", flag: "https://flagsapi.com/GH/flat/64.png" },
  { code: "+224", country: "Guinea", flag: "https://flagsapi.com/GN/flat/64.png" },
  { code: "+245", country: "Guinea-Bissau", flag: "https://flagsapi.com/GW/flat/64.png" },
  { code: "+220", country: "Gambia", flag: "https://flagsapi.com/GM/flat/64.png" },
  { code: "+240", country: "Equatorial Guinea", flag: "https://flagsapi.com/GQ/flat/64.png" },
  { code: "+231", country: "Liberia", flag: "https://flagsapi.com/LR/flat/64.png" },
  { code: "+218", country: "Libya", flag: "https://flagsapi.com/LY/flat/64.png" },
  { code: "+212", country: "Morocco", flag: "https://flagsapi.com/MA/flat/64.png" },
  { code: "+258", country: "Mozambique", flag: "https://flagsapi.com/MZ/flat/64.png" },
  { code: "+95", country: "Seychelles", flag: "https://flagsapi.com/SC/flat/64.png" },
  { code: "+248", country: "Seychelles", flag: "https://flagsapi.com/SC/flat/64.png" },
  { code: "+232", country: "Sierra Leone", flag: "https://flagsapi.com/SL/flat/64.png" },
  { code: "+221", country: "Senegal", flag: "https://flagsapi.com/SN/flat/64.png" },
  { code: "+249", country: "Sudan", flag: "https://flagsapi.com/SD/flat/64.png" },
  { code: "+268", country: "Eswatini", flag: "https://flagsapi.com/SZ/flat/64.png" },
  { code: "+27", country: "South Africa", flag: "https://flagsapi.com/ZA/flat/64.png" },
  { code: "+211", country: "South Sudan", flag: "https://flagsapi.com/SS/flat/64.png" },
  { code: "+249", country: "Sudan", flag: "https://flagsapi.com/SD/flat/64.png" },
  { code: "+240", country: "Equatorial Guinea", flag: "https://flagsapi.com/GQ/flat/64.png" },
  { code: "+228", country: "Togo", flag: "https://flagsapi.com/TG/flat/64.png" },
  { code: "+216", country: "Tunisia", flag: "https://flagsapi.com/TN/flat/64.png" },
  { code: "+255", country: "Tanzania", flag: "https://flagsapi.com/TZ/flat/64.png" },
  { code: "+256", country: "Uganda", flag: "https://flagsapi.com/UG/flat/64.png" },
  { code: "+260", country: "Zambia", flag: "https://flagsapi.com/ZM/flat/64.png" },
  { code: "+263", country: "Zimbabwe", flag: "https://flagsapi.com/ZW/flat/64.png" },
];

export default countryCodes;
  
