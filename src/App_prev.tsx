import './styles.css';
import reactPng from "./React.png";
import reactSvg from "./React-icon.svg";
//import tradeAPI from "./tradeAPI.js";
import axios from "axios";
import { useEffect, useState } from 'react';
//import ReactHtmlParser from 'react-html-parser';

import LightweightChart,{seriesDataSample, ChartTest} from "./ChartTest";

console.log("loaded module", LightweightChart);

import {
  useQuery,
  gql
} from "@apollo/client";
import { PaginatorTest } from './PaginatorTest';
import PairListing, { IInstrument, IInstrumentPair } from './PairListing';

//@ts-ignore
//import indicators from "trading-indicator";
//import ccxt from "ccxt";
//var ccxt = require ('ccxt');

//@ts-ignore

//window.object = {indicators: indicators};
//window.indicators = indicators;

//console.log(indicators);

//
/*
[
    {
        "coin": "BTC",
        "depositAllEnable": true,
        "free": "0.08074558",
        "freeze": "0.00000000",
        "ipoable": "0.00000000",
        "ipoing": "0.00000000",
        "isLegalMoney": false,
        "locked": "0.00000000",
        "name": "Bitcoin",
        "networkList": [
            {
                "addressRegex": "^(bnb1)[0-9a-z]{38}$",
                "coin": "BTC",
                "depositDesc": "Wallet Maintenance, Deposit Suspended", // shown only when "depositEnable" is false.
                "depositEnable": false,
                "isDefault": false,        
                "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
                "minConfirm": 1,  // min number for balance confirmation
                "name": "BEP2",
                "network": "BNB",            
                "resetAddressStatus": false,
                "specialTips": "Both a MEMO and an Address are required to successfully deposit your BEP2-BTCB tokens to Binance.",
                "unLockConfirm": 0,  // confirmation number for balance unlock 
                "withdrawDesc": "Wallet Maintenance, Withdrawal Suspended", // shown only when "withdrawEnable" is false.
                "withdrawEnable": false,
                "withdrawFee": "0.00000220",
                "withdrawIntegerMultiple": "0.00000001",
                "withdrawMax": "9999999999.99999999",
                "withdrawMin": "0.00000440",
                "sameAddress": true  // If the coin needs to provide memo to withdraw
            },
            {
                "addressRegex": "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1)[0-9A-Za-z]{39,59}$",
                "coin": "BTC",
                "depositEnable": true,
                "isDefault": true,
                "memoRegex": "",
                "minConfirm": 1, 
                "name": "BTC",
                "network": "BTC",
                "resetAddressStatus": false,
                "specialTips": "",
                "unLockConfirm": 2,
                "withdrawEnable": true,
                "withdrawFee": "0.00050000",
                "withdrawIntegerMultiple": "0.00000001",
                "withdrawMax": "750",
                "withdrawMin": "0.00100000",
                "sameAddress": false
            }
        ],
        "storage": "0.00000000",
        "trading": true,
        "withdrawAllEnable": true,
        "withdrawing": "0.00000000"
    }
]
*/


// const GetPairSymbols = gql`
//   query {
//     instrumentPairs {
//       symbol
//     }
//   }  
// `;

const GetPriceHistory = gql`
  query {
    instrumentPairHistory(
      pairSymbol: $symbol,
      startUctTime: -1,
      endUctTime: 1632816798402,
    ){
      symbol
      priceHistory{
        utcOpenTime
        open
        close
        high
        low
      }
    }
  }  
`;


// const PaginatorTest = (props: any) => {
//   const { loading, error, data } = useQuery(GetPairSymbols);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   return data.instrumentPairs.map(( pair: any ) => (
//     <div key={pair.symbol}>
//       <p>
//         {pair.symbol}
//       </p>
//     </div>
//   ));
// };


const Accordian = (props: any) => {
  const subComponent = props.subComponent;
  const [isCollapsed, setIsCollapsed] = useState<boolean>(props.isCollapsed || true);


  const subStyle = isCollapsed ? {display:"none"} : {display:"table-row"};
  const icon = isCollapsed ? "▷" : "▽";

  const iconClick = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <table>
      <tr>
        <td><span onClick={iconClick.bind(this)}>{icon}</span></td>
        <td>{props.children}</td>
      </tr>
      <tr style={subStyle}>
        <td></td>
        <td>{subComponent}</td>
      </tr>
    </table>
  );
}


// const replaceAllAdvanced(text, match){

// }

function getIndiciesOf(text: string, find: string){
//function getIndiciesOf(text, find){
  let index = 0;
  const indicies = [];
  let rest = text;
  //console.log("text, find", text, find);
  while(index < text.length){
    const found = rest.indexOf(find);
    if(found != -1){      
      //console.log("index,found+find.length", index, found+find.length);
      indicies.push(index + found);
      index += found + find.length;
      rest = text.substr(index);
    }else return indicies;
  }
  return indicies;
}

//@ts-ignore
function splitAtIndicies(text, indicies, length){//all odd are matches
  let results = [];
  let prevIndex = 0;
  for(const index of indicies){
    const prev = text.substr(prevIndex, index - prevIndex);
    const cur = text.substr(index, length);
    prevIndex = index + length;
    results.push(prev, cur);
  }
  const last = text.substr(prevIndex);
  results.push(last);
  return results;
}

//@ts-ignore
window.test = (text, find, replace) => {
  return replaceAllIgnoreCase(text, find, replace);
  // var inds = getIndiciesOf(text, find);
  // return splitAtIndicies(text, inds, find.length);
};

//@ts-ignore
function replaceAllIgnoreCase(text, find, replaceF){
  var textLwr = text.toLowerCase();
  var findLwr = find.toLowerCase();
  var inds = getIndiciesOf(textLwr, findLwr);
  var split = splitAtIndicies(text, inds, find.length);
  //console.log("split", split);
  for(var a=1; a<split.length; a+=2){
    split[a] = replaceF(split[a]);
  }
  return split.join("");
}

const FindHighlight = (props: any) => {
  const text = props.text;
  const match = props.match;

  //const txResult = text.replaceAll(match,`<span style="background-color:yellow">${match}</span>`);
  let txResult = text;
  if(match != ""){
    const replaceF = ((found: string) => `<span style="background-color:yellow">${found}</span>`);
    txResult = replaceAllIgnoreCase(text, match, replaceF);
  }

  return (
    <span dangerouslySetInnerHTML={{ __html: txResult }} />
  );
};

/* Docs:

isLegalMoney: i.e. national currency


*/


interface ICoinResponse{
  coin: string
  depositAllEnable: boolean
  free: string //float
  freeze: string //float
  ipoable: string //float
  ipoing: string //float
  isLegalMoney: boolean
  locked: string //float
  name: string
  networkList: any[]
  storage: string //float
  trading: boolean,
  withdrawAllEnable: boolean,
  withdrawing: string //float 
}

interface IMarginPairResponse{
  base: string //base symbol(1st) eg BNB
  id: number 
  isBuyAllowed: boolean 
  isMarginTrade: boolean 
  isSellAllowed: boolean 
  quote: string //in value symbol eg BTC
  symbol: string // pair symbol eg "BNBBTC"
}

interface IExchangeSymbol{//aka a pair
  symbol: string //ETHBTC,
  status: string //TRADING,
  baseAsset: string //ETH,
  baseAssetPrecision: number //8,
  quoteAsset: string //BTC,
  quotePrecision: number //8
  orderTypes: string[] //[LIMIT, MARKET],
  icebergAllowed: boolean
  filters: any[]
}

interface IExchangeInfo{
  timezone: string
  serverTime: number
  rateLimits: any[]
  exchangeFilters: any[]
  symbols: IExchangeSymbol[]
} 



type ILookup<T> = {
  [key: string]: T
}

type ILookupSet = {
  coinSymbolLookup: ILookup<ICoinResponse> | void
  baseSymbolLookup: ILookup<IExchangeSymbol[]> | void
  quoteSymbolLookup: ILookup<IExchangeSymbol[]> | void
}

function getBaseSymbolLookup(symbols: IExchangeSymbol[]){ // what its quoted in...
  const quotedLookup: ILookup<IExchangeSymbol[]> = {};
  for(var symPair of symbols){
    if(quotedLookup[symPair.baseAsset] === undefined) quotedLookup[symPair.baseAsset] = [];
    quotedLookup[symPair.baseAsset].push(symPair);
  }
  return quotedLookup;
}


function getQuotedSymbolLookup(symbols: IExchangeSymbol[]){ // what is quoted in it...
  const quotedLookup: ILookup<IExchangeSymbol[]> = {};
  for(var symPair of symbols){
    if(quotedLookup[symPair.quoteAsset] === undefined) quotedLookup[symPair.quoteAsset] = [];
    quotedLookup[symPair.quoteAsset].push(symPair);
  }
  return quotedLookup;
}

function getCoinSymbolLookup(coins : ICoinResponse[]){ // what its quoted in...
  const coinSymbolLookup: ILookup<ICoinResponse> = {};
  for(var coin of coins){
    //if(coinSymbolLookup[coin.coin] === undefined) coinSymbolLookup[coin.coin] = [];
    coinSymbolLookup[coin.coin] = coin;
  }
  return coinSymbolLookup;
}





const apiUrl = `http://localhost:5000/`;

class InstrumentStat{
  symbol: string;
  name: string;
  instrumentData: IInstrument;
  
  constructor(instrument: IInstrument){
      this.instrumentData = instrument;
      this.symbol = instrument.symbol;
      this.symbol = instrument.name;
  }

}

class InstrumentPairStat{
  symbol: string;
  name: string;

  baseInstrument: InstrumentStat;
  quoteInstrument: InstrumentStat;

  instrumentPairData: IInstrumentPair;

  getName(){
    return `${this.baseInstrument.name} / ${this.quoteInstrument.name} `;
  }


  constructor(instrumentPair: IInstrumentPair, baseInstrument:InstrumentStat,  quoteInstrument:InstrumentStat){
    this.instrumentPairData = instrumentPair;  
    
    this.name = this.getName();

    this.baseInstrument = baseInstrument;
    this.quoteInstrument = quoteInstrument;

    this.symbol = instrumentPair.symbol;
  }
}


export const App = () => {
  //useQuery()

  const [] = useState({});



  const getCoins = async() => {
    const endPoint = `${apiUrl}${"coins"}`; 
    console.log("endPoint:", endPoint);
    const response = await axios.get<ICoinResponse[]>(endPoint);
    if (response.status == 200) {
      //return response.data;
      console.log("resp:", response.data);
      return response.data;
    }
    throw new Error(response.status.toString());
    //console.log("resp:", response);

  }

  const getMarginPairs = async() => {
    const endPoint = `${apiUrl}${"pairs"}`; 
    console.log("endPoint:", endPoint);
    const response = await axios.get<IMarginPairResponse[]>(endPoint);
    if (response.status == 200) {
      //return response.data;
      console.log("resp:", response.data);
      return response.data;
    }
    throw new Error(response.status.toString());
    //console.log("resp:", response);

  }
  const getSymbols = async() => {
    const endPoint = `${apiUrl}${"exchange_info"}`; 
    console.log("endPoint:", endPoint);
    const response = await axios.get<IExchangeInfo>(endPoint);
    if (response.status == 200) {
      //return response.data;
      console.log("resp:", response.data);
      return response.data;
    }
    throw new Error(response.status.toString());
    //console.log("resp:", response);

  }


  const [coinsState, setCoinsState] = useState<ICoinResponse[]>([]);
  const [symbolsState, setSymbolsState] = useState<IExchangeSymbol[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [lookups, setLookups] = useState<ILookupSet>({
    coinSymbolLookup: undefined,
    baseSymbolLookup: undefined,
    quoteSymbolLookup: undefined,
  });

  //let coinSymbolLookup: ILookup;

  useEffect(()=>{
    const setup = async() => {
      const coins = await getCoins();
      coins.sort((a,b)=> a.name.localeCompare(b.name));
      const coinSymbolLookup = getCoinSymbolLookup(coins);
      lookups.coinSymbolLookup = coinSymbolLookup;
      setLookups(lookups);

      console.log("set")
      
      setCoinsState(coins);

      //@ts-ignore
      window.coinSymbolLookup = coinSymbolLookup; 

      const exchangeInfo = await getSymbols();
      const quotedLookup = getBaseSymbolLookup(exchangeInfo.symbols);
      const quotedInLookup = getQuotedSymbolLookup(exchangeInfo.symbols);
      setSymbolsState(exchangeInfo.symbols);

      //@ts-ignore
      window.pairsLookup = quotedLookup;
      //@ts-ignore
      window.quotedInLookup = quotedInLookup;
    };
    setup();
  }, []);

  let coinsTp = [...coinsState];
  let symbolsTp = [...symbolsState];
  //let coinsTp = coinsState.filter(c => c.isLegalMoney)

  //filter on search text:
  // if(searchText != ""){
  //   coinsTp = coinsState.filter(c => c.isLegalMoney)
  // }


  let symbolsListing: any[] = [];
  if(lookups.coinSymbolLookup !== undefined){
    console.log("got coinSymbolLookup");
    symbolsListing = symbolsTp.map(symbol => {
      const asString = JSON.stringify(symbol, null, 4);
      const comp = <pre style={{backgroundColor:"black", color:"white"}}>{asString}</pre>;
      //const textMain = `${symbol.name} (${symbol.coin})`;   

      //@ts-ignore
      const baseName = lookups.coinSymbolLookup[symbol.baseAsset] ? lookups.coinSymbolLookup[symbol.baseAsset].name : "?";
      //console.log("baseName?", baseName);
      //@ts-ignore
      const quoteName = lookups.coinSymbolLookup[symbol.quoteAsset] ? lookups.coinSymbolLookup[symbol.quoteAsset].name : "?";

      const shortText = `${symbol.baseAsset}/${symbol.quoteAsset}`;
      const textMain = `(${shortText}) ${baseName} / ${quoteName}`; 
      

      return ({
        component: <Accordian subComponent={comp}>
          <FindHighlight text={textMain} match={searchText}/>
        </Accordian>,
        mainText: textMain,
      });
    });
  }

  let coinslisting = coinsTp.map(coin => {
    const asString = JSON.stringify(coin, null, 4);
    const comp = <pre style={{backgroundColor:"black", color:"white"}}>{asString}</pre>;
    const textMain = `${coin.name} (${coin.coin})`;   

    return ({
      component: <Accordian subComponent={comp}>
        <FindHighlight text={textMain} match={searchText}/>
      </Accordian>,
      mainText: textMain,
    });
  });

  if(searchText != ""){
    coinslisting = coinslisting.filter(l => 
      l.mainText.toLowerCase().indexOf(searchText.toLowerCase()) != -1
    );

    symbolsListing = symbolsListing.filter(s => 
      s.mainText.toLowerCase().indexOf(searchText.toLowerCase()) != -1
    );
  }


  const onInput = (event: any) => {
    //console.log("got input", event.target.value);
    const find = event.target.value;
    if(find != searchText){
      setSearchText(find);
    }
  };

  const onListingSelect = (instrPair: IInstrumentPair) =>{
    console.log("instrPair?", instrPair);
  };

  //let ticker = indicators.ticker("binance", "BTC/USDT", true);
    return (
      <>
        <ChartTest/>
        <PairListing onSelect={onListingSelect}/>
        
        <PaginatorTest/>
        <FindHighlight text="abcdhjkabcjklaba" match="a"/>
        <Accordian subComponent={"that"}>
          this
        </Accordian>



        <h1>Crypocurrency listing</h1>
        <input onInput={onInput}/>
        <ul>
          { symbolsListing.map(l=>l.component) }
        </ul>
      </>
    )
  }