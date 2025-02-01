import { useQuery, gql } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

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
  const { loading, error, data } = useQuery<CountriesData>(GET_COUNTRIES); // Menggunakan hook useQuery untuk mengambil data negara

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref untuk menentukan posisi scroll ke bawah

  const scrollToBottom = () => {
    // Scroll otomatis ke bawah setiap kali ada pesan baru
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Memanggil scrollToBottom setiap kali pesan baru ditambahkan
  }, [messages]); // Menggunakan efek untuk melacak perubahan pesan

  const handleSend = async () => {
    // Validasi input
    if (!input) {
      console.error("Input is required");
      return;
    }

    // Menandai bahwa chat telah dimulai
    if (!chatStarted) {
      setChatStarted(true);
    }

    // Menambahkan pesan user ke dalam array
    setMessages([
      ...messages,
      { role: "user", content: input },
      {
        role: "assistant",
        content: "AI is typing...", // Indikator bahwa AI sedang menulis
      },
    ]);

    try {
      // Kirim permintaan ke server
      const response = await axios.post(
        "http://localhost:3000/generate",
        { content: input },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update pesan dengan respons dari AI
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, prevMessages.length - 1), // Menghapus pesan "AI is typing..."
        {
          role: "assistant",
          content: response.data.result || "No response from AI", // Menampilkan respons dari AI
        },
      ]);
    } catch (error) {
      // Tangani kesalahan
      console.error("Error connecting to API", error);
      setMessages([
        ...messages,
        { role: "user", content: input },
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
        },
      ]);
    }

    setInput(""); // Reset kolom input setelah mengirim pesan
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Menentukan jumlah negara yang ditampilkan
  const displayedCountries = showAll
    ? data?.countries
    : data?.countries.slice(0, 6);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Jika chat sudah dimulai, hanya tampilkan chat */}
      {chatStarted ? (
        <div className="flex flex-col min-h-screen">
          <div className="p-4 ">
            <h2 className="text-xl font-semibold text-center">
              Chat Assistant
            </h2>
          </div>

          {/* Area Chat */}
          <div className="flex-1 py-4 px-8 md:py-12 md:px-28">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 md:mb-6 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block py-2 px-4 rounded-lg ${
                    msg.role === "user"
                      ? "bg-gray-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Chat */}
          <div className="w-full p-8 shadow-lg">
            <div className="relative max-w-md mx-auto">
              <input
                placeholder="Ask AI"
                className="input w-full pr-12 pl-3 py-2 bg-white text-gray-500 outline-none border shadow-sm rounded-lg border-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>
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
      ) : (
        // Jika chat belum dimulai, tampilkan daftar negara
        <>
          <div className="text-center">
            <h1 className="text-xl text-gray-500">Hi, there👋🏻</h1>
            <p className="text-2xl font-bold">How Can We Help?</p>
          </div>

          <div className="max-w-screen-lg mx-auto px-4 md:px-8 pb-20">
            <div className={`${showAll ? "hide-scrollbar max-h-[500px]" : ""}`}>
              <ul className="mt-8 grid gap-3 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 grid-auto-rows-auto">
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
                      <div className="space-y-2">
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
                        onClick={() =>
                          setSelectedCountry(
                            selectedCountry === country ? null : country
                          )
                        }
                        className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        {selectedCountry === country ? "Close" : "More Info"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="text-center my-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 text-white rounded-lg"
                >
                  {showAll ? "Show Less" : "Show All"}
                </button>
              </div>
            </div>
          </div>

          {/* Input Chat (Awal) */}
          <div className="fixed bottom-0 w-full p-8 bg-gray-100 shadow-lg z-10">
            <div className="relative max-w-md mx-auto">
              <input
                placeholder="Ask AI"
                className="input w-full pr-12 pl-3 py-2 bg-white text-gray-500 outline-none border shadow-sm rounded-lg border-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>
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
        </>
      )}
    </div>
  );
}

export default CountryList;
