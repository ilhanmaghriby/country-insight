import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

// Definisi tipe untuk struktur data negara
interface Language {
  name: string;
}

interface Country {
  continent: any;
  name: string;
  emoji: string;
  capital: string;
  currency: string;
  languages: Language[];
}

interface CountriesData {
  countries: Country[];
}

// Query untuk mengambil data negara
const GET_COUNTRIES = gql`
  query {
    countries {
      name
      emoji
      capital
      currency
      languages {
        name
      }
      continent {
        name
      }
    }
  }
`;

function CountryList() {
  const { loading, error, data } = useQuery<CountriesData>(GET_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(selectedCountry === country ? null : country);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Menentukan jumlah negara yang ditampilkan
  const displayedCountries = showAll
    ? data?.countries
    : data?.countries.slice(0, 6);

  return (
    <div className="pt-8 bg-gray-100 min-h-screen">
      <div className="text-center">
        <h1 className="text-xl text-gray-500">Hi, there👋🏻</h1>
        <p className="text-2xl font-bold">How Can We Help?</p>
      </div>

      {/* Card Section with Conditional Scrollable Container */}
      <div className="max-w-screen-lg mx-auto px-4 md:px-8 ">
        <div
          className={`${showAll ? "hide-scrollbar max-h-[500px]" : ""}`} // Apply hide-scrollbar conditionally
        >
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 grid-auto-rows-auto">
            {displayedCountries?.map((country) => (
              <li
                key={country.name}
                className={`border border-gray-300 bg-white shadow rounded-lg transition-all duration-300 self-start ${
                  selectedCountry === country
                    ? "min-h-[200px]"
                    : "min-h-[150px]"
                }`}
              >
                <div className="flex flex-col justify-between p-4 h-full">
                  <div className="space-y-2 ">
                    <span>{country.emoji}</span>
                    <h3 className="font-semibold text-center">
                      {country.name}
                    </h3>
                    <h4 className="text-gray-800 text-sm flex justify-between">
                      Capital
                      <span className="text-gray-600">
                        {country.capital || "No capital data available"}
                      </span>
                    </h4>
                    <h4 className="text-gray-800 text-sm flex justify-between">
                      Currency
                      <span className="text-gray-600">
                        {country.currency || "No currency data available"}
                      </span>
                    </h4>

                    {selectedCountry === country && (
                      <>
                        <h4 className="text-gray-800 text-sm flex justify-between">
                          Languages
                          <span className="text-gray-600">
                            {country.languages
                              .map((lang) => lang.name)
                              .join(", ")}
                          </span>
                        </h4>
                        <h4 className="text-gray-800 text-sm flex justify-between">
                          Continent
                          <span className="text-gray-600">
                            {country.continent?.name ||
                              "No continent data available"}
                          </span>
                        </h4>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectCountry(country)}
                    className="mt-4  text-sm font-medium button-text"
                  >
                    {selectedCountry === country ? "Close" : "More Info"}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Tombol Load More */}
          <div className="text-center my-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="button px-4 py-2  text-white rounded-lg"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          </div>
        </div>
      </div>

      {/* Input Field at the Bottom */}
      <div className="fixed bottom-0  w-full p-8  shadow-lg z-10">
        <div className="relative max-w-md mx-auto">
          <input
            placeholder="Ask AI"
            className="input w-full pr-12 pl-3 py-2 bg-white text-gray-500 bg-transparent outline-none border shadow-sm rounded-lg border-gray-400"
          />
          <button onClick={() => console.log("clicked")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-3 top-3 w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M21 12l-18 0 9-9 3 6 6 3-6 3-3 6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CountryList;
