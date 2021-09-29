import {
    useQuery,
    gql
} from "@apollo/client";

const GetPairSymbols = gql`
  query {
    instrumentPairs {
      symbol
    }
  }  
`;


export const PaginatorTest = (props: any) => {
    const { loading, error, data } = useQuery(GetPairSymbols);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
  
    return data.instrumentPairs.map(( pair: any ) => (
      <div key={pair.symbol}>
        <p>
          {pair.symbol}
        </p>
      </div>
    ));
  };