import {
    useQuery,
    gql
} from "@apollo/client";
import { Pagination, Stack } from "@mui/material";
import { useState } from "react";
import { InstrumentPairStat, InstrumentStat } from "../Utilities/TradeUtitlies";
import FindHighlight from "./FindHighlight";

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
    setOnStateCreate?: any
}

interface IPairListItemProps {
    pair: InstrumentPairStat
    onSelect?: (pairListItem: InstrumentPairStat) => void
    searchText: string
}

const PairListItem = (props: IPairListItemProps) => {
    const onSelect = () => {
        if(props.onSelect)
            props.onSelect(props.pair);
    };

    const name =  props.pair.getNiceName();// `${props.pair.baseInstrument.name} / ${props.pair.quoteInstrument.name}`;
    const symbol = props.pair.getNiceSymbol();//`${props.pair.baseInstrument.symbol} / ${props.pair.quoteInstrument.symbol}`;
    
    return (
        <tr onClick={onSelect} className={"listingTr"}>
            <td>
                <FindHighlight match={props.searchText} text={symbol} highlightClassName={"listingHighlight"}/>
            </td>
            <td>
                <FindHighlight match={props.searchText} text={name} highlightClassName={"listingHighlight"}/>
            </td>
        </tr>
    );
}

const PairListing = (props: IPairListingProps) => {
    const resultsPerPage = 10;
    const { loading, error, data } = useQuery(GetPairSymbols);
    const [state, setState] = useState<any>({searchText:"", page:0});

    if(props.setOnStateCreate) props.setOnStateCreate([state, setState]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    
    var instrumentPairStats = data.instrumentPairs.map((pair: IInstrumentPair ) => {
        var base = new InstrumentStat(pair.baseInstrument);
        var quote = new InstrumentStat(pair.quoteInstrument);//TODO: Add to lookup
        return new InstrumentPairStat(pair, base, quote);
    });        
    
    let filtered = instrumentPairStats;
    if(state.searchText != "")
        filtered = instrumentPairStats.filter(
            (p:InstrumentPairStat)=> {
                return (p.getNiceName().toLowerCase().indexOf(state.searchText.toLowerCase()) != -1
                    || p.getNiceSymbol().toLowerCase().indexOf(state.searchText.toLowerCase()) != -1
                );
            });


    const pageStart = resultsPerPage * state.page;        
    const pageEnd = resultsPerPage * (state.page+1); 
    const pageCount = (filtered.length % resultsPerPage) == 0 ? 
        Math.trunc(filtered.length / resultsPerPage):
        Math.trunc(filtered.length / resultsPerPage) + 1;

    const paginated = filtered.slice(pageStart, pageEnd);

    const onPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        const newState = {...state};
       newState.page = page - 1;
       setState(newState);
    };

    return (
        <div className={"pairListing"}>
            <table className={"pairListingTable"}>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        paginated.map(( pair: any, index: number ) => (
                            <PairListItem
                                key={index} 
                                pair={pair} 
                                onSelect={props.onSelect}
                                searchText={state.searchText}
                            />))
                    }
                </tbody>
            </table>
            <div>
                <Stack spacing={2}>
                    <Pagination 
                        className={"paginator"} 
                        onChange={onPageChange} 
                        count={pageCount} 
                        variant="outlined" 
                        shape="rounded"
                    />
                </Stack>
            </div>
        </div>
        );
};



export default PairListing;
