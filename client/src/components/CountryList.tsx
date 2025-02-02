import { useQuery, gql } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import AOS from "aos";
import "aos/dist/aos.css";

// Definition of type for country data structure
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

// Query to retrieve country data
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
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  // Ref to determine scroll position downward
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialization of AOS (Animate On Scroll)
  AOS.init();

  // Automatically scroll down every time there is a new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Using effects to track message changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to send a request to AI
  const handleSend = async (message?: string) => {
    const userMessage = message || input;
    // Input validation
    if (!userMessage) {
      console.error("Input is required");
      return;
    }
    // Reset input fields after sending a message
    setInput("");

    // Mark that the chat has started
    if (!chatStarted) {
      setChatStarted(true);
    }

    // Add the user's message to the array
    setMessages([
      ...messages,
      { role: "user", content: userMessage },
      {
        role: "assistant",
        content: "AI is typing...", // Indicator that the AI is typing
      },
    ]);

    try {
      // Send a request to the server
      const response = await axios.post(
        "http://localhost:3000/generate",
        { content: userMessage },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update the message with the response from AI
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, prevMessages.length - 1), // Remove the typing indicator
        {
          role: "assistant",
          content: response.data.result || "No response from AI", // Handle empty response
        },
      ]);
    } catch (error) {
      // Handle errors
      console.error("Error connecting to API", error);
      setMessages([
        ...messages,
        { role: "user", content: userMessage },
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
        },
      ]);
    }
  };

  // Function to ask AI about a specific country
  const handleAskAI = (countryName: string) => {
    const question = `Give me more info about ${countryName} country?`;
    handleSend(question);
  };

  // Loading and error handling
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  // Determine the number of countries to display
  const displayedCountries = showAll
    ? data?.countries
    : data?.countries.slice(0, 6);

  return (
    <div className="bg-white min-h-screen">
      {/* If the chat has started, only display the chat */}
      {chatStarted ? (
        <div className="flex flex-col min-h-screen">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-center">
              Chat Assistant
            </h2>
          </div>

          {/* Area Chat */}
          <div className="flex-1 py-4 px-8 md:px-28">
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
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Chat */}
          <div className="w-full p-8 shadow-lg">
            <div className="relative max-w-md mx-auto">
              <input
                required
                placeholder="Ask AI"
                className="input w-full pr-12 pl-3 py-2 bg-white text-gray-500 outline-none border shadow-sm rounded-lg border-gray-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={() => handleSend()}>
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
        // If the chat hasn't started, display the list of countries
        <div className="min-h-screen place-content-center pt-4">
          <div
            className="text-center"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <h1 className="text-xl text-gray-500">
              Hi there<span className="wave">👋</span>
            </h1>
            <div className="grid place-items-center">
              <h2 className="typing-demo text-2xl font-bold mb-3">
                How Can We Help?
              </h2>
            </div>
          </div>
          <div className="max-w-screen-lg mx-auto px-4 md:px-8 pb-20">
            <div className={`${showAll ? "hide-scrollbar max-h-[500px]" : ""}`}>
              <ul
                className="grid gap-3 md:gap-5 sm:grid-cols-2 lg:grid-cols-3 grid-auto-rows-auto"
                data-aos="zoom-in-up"
                data-aos-duration="800"
              >
                {displayedCountries?.map((country) => (
                  <li
                    key={country.name}
                    className={`border border-gray-200 bg-white shadow rounded-lg transition-all duration-300 self-start ${
                      selectedCountry === country
                        ? "min-h-[200px]"
                        : "min-h-[150px]"
                    }`}
                  >
                    <div className="flex flex-col justify-between p-4 h-full ">
                      <div className="space-y-2">
                        <h4 className="text-gray-800 text-sm flex justify-between">
                          {country.emoji}
                          <span>
                            <button
                              className="text-sm font-medium text-gray-500 hover:text-gray-700"
                              onClick={() => handleAskAI(country.name)}
                            >
                              Ask AI
                            </button>
                          </span>
                        </h4>

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

                        {/* Display additional information when a country is selected */}
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
              <div
                className="text-center my-4"
                data-aos="zoom-in"
                data-aos-duration="800"
              >
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 text-white rounded-lg"
                >
                  {showAll ? "Show Less" : "Show All"}
                </button>
              </div>
            </div>
          </div>

          {/* Input Chat */}
          <div className="fixed bottom-0 w-full p-6 bg-white shadow-lg z-10">
            <div className="relative max-w-md mx-auto">
              <input
                required
                placeholder="Ask AI"
                className="input w-full pr-12 pl-3 py-2 bg-white text-gray-500 outline-none border shadow-sm rounded-lg border-gray-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={() => handleSend()}>
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
      )}
    </div>
  );
}

export default CountryList;
