import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import CountryList from "./components/CountryList";
import Login from "./components/Login";

// Komponen utama
function App() {
  // Setup Apollo Client
  const client = new ApolloClient({
    uri: import.meta.env.VITE_COUNTRY_URL, // Endpoint GraphQL API
    cache: new InMemoryCache(), // Cache untuk menyimpan data
  });

  return (
    <ApolloProvider client={client}>
      <Login />
      <CountryList />
    </ApolloProvider>
  );
}

export default App;
