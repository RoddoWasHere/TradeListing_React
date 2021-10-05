import ReactDOM from "react-dom";
import { App } from "./App";


import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    gql
} from "@apollo/client";
import { TradeInfoProvider } from "./Utilities/TradeUtitlies";


const client = new ApolloClient({
    uri: 'https://localhost:5001/graphql',
    cache: new InMemoryCache(),
    typeDefs: gql`
        enum KlineInterval {
            ONE_MINUTE
            THREE_MINUTES
            FIVE_MINUTES
            FIFTEEN_MINUTES
            THIRTY_MINUTES
            ONE_HOUR
            TWO_HOUR
            FOUR_HOUR
            SIX_HOUR
            EIGHT_HOUR
            TWELVE_HOUR
            ONE_DAY
            THREE_DAY
            ONE_WEEK
            ONE_MONTH
        }
    `,
});
 
ReactDOM.render(
    <ApolloProvider client={client}>
        <TradeInfoProvider>
            <App />
        </TradeInfoProvider>
    </ApolloProvider>,
    document.getElementById("root")
);