import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import CountryList from "./CountryList";

// Komponen utama
function App() {
  // Setup Apollo Client
  const client = new ApolloClient({
    uri: import.meta.env.VITE_COUNTRY_URL, // Endpoint GraphQL API
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <CountryList />
    </ApolloProvider>
  );
}

export default App;
