import {
    useQuery,
    gql
} from "@apollo/client";
import { InstrumentPairStat, InstrumentStat } from "./TradeUtitlies";

const GetPairSymbols = gql`
  query {
    instrumentPairs {
        symbol
        baseInstrument{
          symbol
          name
        }
        quoteInstrument{
          symbol
          name
        }
      }
  }  
`;


export interface IInstrument{
    symbol: string
    name: string
    //...
}

export interface IInstrumentPair{
    symbol: string
    baseInstrument: IInstrument
    quoteInstrument: IInstrument
}

interface IPairListingProps {
    onListingSelect?: (listItem: any) => void
    onSelect?: (pairListItem: InstrumentPairStat) => void
}

interface IPairListItemProps {
    pair: InstrumentPairStat
    onSelect?: (pairListItem: InstrumentPairStat) => void
}

const PairListItem = (props: IPairListItemProps) => {
    const onSelect = () => {
        if(props.onSelect)
            props.onSelect(props.pair);
    };

    return (
        <tr>
            <td onClick={onSelect}>{props.pair.baseInstrument.symbol} / {props.pair.quoteInstrument.symbol}</td>
            <td>{props.pair.baseInstrument.name} / {props.pair.quoteInstrument.name}</td>
        </tr>
    );
}

const PairListing = (props: IPairListingProps) => {
    const { loading, error, data } = useQuery(GetPairSymbols);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    
    var instrumentPairStats = data.instrumentPairs.map( (pair: IInstrumentPair ) => {
        var base = new InstrumentStat(pair.baseInstrument);
        var quote = new InstrumentStat(pair.quoteInstrument);//TODO: Add to lookup
        return new InstrumentPairStat(pair, base, quote);
    });        
    //var tit
    
    const divMainStyle = {
        height: "300px",
        overflow: "scroll",
    } as React.CSSProperties;

    return (
        <div style={divMainStyle}>
            <table>
            <tr>
                <th>Symbol</th>
                <th>Name</th>
            </tr>
            {
                instrumentPairStats.map(( pair: any ) => (
                    <PairListItem 
                        pair={pair} 
                        onSelect={props.onSelect}
                    />))//(
            }
            </table>
        </div>
        );
};

export default PairListing;
