import { useState } from 'react';
import countryCodes, { CountryCode } from './countryCodes';
import { Search } from 'lucide-react';

export default function CountryFlags() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countryCodes.filter(country =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  const uniqueCountries = Array.from(
    new Map(filteredCountries.map(c => [c.country, c])).values()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">World Countries</h1>
          <p className="text-gray-600 text-lg">Browse flags and country codes</p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by country name or code..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {uniqueCountries.map((country: CountryCode) => (
            <div
              key={country.country}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 p-4 text-center cursor-pointer group"
            >
              <div className="mb-3 h-12 flex items-center justify-center">
                <img
                  src={country.flag}
                  alt={country.country}
                  className="h-10 object-contain"
                />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                {country.country}
              </p>
              <p className="text-xs font-mono text-blue-600 group-hover:text-blue-700">
                {country.code}
              </p>
            </div>
          ))}
        </div>

        {uniqueCountries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No countries found matching "{searchTerm}"</p>
          </div>
        )}

        <div className="mt-12 text-center text-gray-600 text-sm">
          Showing {uniqueCountries.length} countries
        </div>
      </div>
    </div>
  );
}
