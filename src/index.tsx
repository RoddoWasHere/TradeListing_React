import ReactDOM from "react-dom";
import { App } from "./App";


import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";
import { TradeInfoProvider } from "./TradeUtitlies";



const client = new ApolloClient({
    uri: 'https://localhost:5001/graphql',
    cache: new InMemoryCache()
});
 
console.log("testing client...");

client
  .query({
    query: gql`
      query {
        instrumentPairs{
            symbol
        }
      }
    `
  })
  .then(result => console.log("query test", result));
  


ReactDOM.render(
    <ApolloProvider client={client}>
        <TradeInfoProvider>
            <App />
        </TradeInfoProvider>
    </ApolloProvider>,
    document.getElementById("root")
);