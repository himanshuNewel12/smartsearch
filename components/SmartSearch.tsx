'use client'

import { useState, useEffect, useMemo } from "react";
import { Search, XCircle, Loader } from "lucide-react";
import { debounce } from "lodash";
import { countries } from "./constants";

interface Country {
  id: number;
  name: string;
  capital: string;
  population: string;
}

export default function SmartSearch() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<Country | null>(null);

  const searchCountries = useMemo(
    () =>
      debounce((searchTerm: string) => {
        if (searchTerm.length < 3 || selected) return;
        setLoading(true);
        setTimeout(() => {
          const filtered = countries.filter(
            (country) =>
              country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              country.capital.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setResults(filtered);
          setLoading(false);
        }, 500);
      }, 300),
    [selected]
  );

  useEffect(() => {
    if (!selected) {
      searchCountries(query);
    }
    return () => searchCountries.cancel();
  }, [query, selected, searchCountries]);

  const handleSelectCountry = (country: Country) => {
    setResults([]);
    setQuery(country.name);
    setSelected(country);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelected(null);
  };

  const handleClearQuery = () => {
    setQuery("");
    setSelected(null);
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Search for your Country</h1>
      <div className="relative flex items-center border p-2 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all">
        <Search className="w-5 h-5 text-gray-500 ml-2" />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search for a country..."
          className="w-full pl-3 pr-10 py-2 text-gray-700 outline-none border-none"
        />
        {query && (
          <XCircle
            className="w-5 h-5 text-gray-500 cursor-pointer mr-2"
            onClick={handleClearQuery}
          />
        )}
      </div>
      {loading && <Loader className="animate-spin mx-auto mt-2" />}
      <div className="absolute w-full bg-white shadow-lg mt-2 rounded-lg z-10 max-h-60 overflow-auto">
        {query.length >= 3 && !selected && results.length === 0 && !loading && (
          <p className="p-3 text-gray-600">No results found</p>
        )}
        {results.map((country) => (
          <div
            key={country.id}
            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
            onClick={() => handleSelectCountry(country)}
          >
            <span className="font-semibold">{country.name}</span> - {country.capital}
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Country Details</h3>
          <p><strong>Name:</strong> {selected.name}</p>
          <p><strong>Capital:</strong> {selected.capital}</p>
          <p><strong>Population:</strong> {selected.population}</p>
        </div>
      )}
    </div>
  );
}