import './styles.css';
import reactPng from "./React.png";
import reactSvg from "./React-icon.svg";
//import tradeAPI from "./tradeAPI.js";
import axios from "axios";
import { CSSProperties, useEffect, useState } from 'react';
//import ReactHtmlParser from 'react-html-parser';

import LightweightChart,{seriesDataSample, ChartTest, IChartState} from "./ChartTest";

console.log("loaded module", LightweightChart);

import {
  useQuery,
  gql
} from "@apollo/client";
import { PaginatorTest } from './PaginatorTest';
import PairListing, { IInstrument, IInstrumentPair } from './PairListing';
import { InstrumentPairStat, ITradeInfoProviderState, KlineInterval, useTradeInfo } from './TradeUtitlies';
import { IRadioSelectItem, RadioSelect } from './Components';

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


export const Accordian = (props: any) => {
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

export const FindHighlight = (props: any) => {
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


class InnerState{
  state: any;
  setState = (stateSet: any) => {};

  object: any = {state:""};

  constructor(){
    this.state = {};
  }

  getOnStateCreate(){
    const f = (newState: any[]) =>{
      this.onStateCreate(newState);
    };
    return f;
  }

  onStateCreate(newStateSet:any[]) {
    console.log("onStateCreate?", newStateSet[0], newStateSet[1]);
    var newState = newStateSet[0];
    
    //this.object.state = 2;
    this.state = newStateSet[0];
    this.setState = newStateSet[1];
  };
 
};




//@ts-ignore
window.InnerState = InnerState;

interface ISymbolPairPreviewProps{
  instrumentPair: InstrumentPairStat
  setOnStateCreate: any
}

interface ISymbolPairPreviewState{
  symbol: string
  instrumentPair: InstrumentPairStat | null
  klineInterval: KlineInterval
}

const SymbolPairPreview = (props: ISymbolPairPreviewProps) => {
  
  const tradeInfo: ITradeInfoProviderState = useTradeInfo();

  //@ts-ignore
  window.tradeInfo = tradeInfo;


  console.log("(Preview) tradeInfo", tradeInfo);

  let chartStateNew = new InnerState();
  const [state, setStateAux] = useState<ISymbolPairPreviewState>({
      klineInterval: KlineInterval.OneDay,
      instrumentPair: props.instrumentPair,
      symbol:"",
      //selectedRadioItem: null,
  });
  const setState = (newState: ISymbolPairPreviewState) =>{
    console.log("got external setState (preview)", newState);

    //forward state down
    //chartStateNew.setState(
    const symbol = newState.instrumentPair ? newState.instrumentPair.symbol : "";

    const newChartState: IChartState = {
      //symbol: newState.instrumentPair.symbol, 
      symbol: symbol,//newState.instrumentPair?.symbol,// .instrumentPair.symbol,
      klineInterval: newState.klineInterval,
      timeSeries:[]
    }
    chartStateNew.setState(newChartState);
    //});

    setStateAux(newState);
  }
  props.setOnStateCreate([state, setState]);

  const name = state.instrumentPair ? state.instrumentPair.name : " no name? ";
  const symbol = state.instrumentPair ? state.instrumentPair.symbol : " no symbol? ";

  //const klineInterval = KlineInterval.OneDay;
  const setKlineInterval = (newInterval: KlineInterval) => {
      
      var newState = {...state};
      newState.klineInterval = newInterval;
      console.log("(setKlineInterval) got cur state", state, newState);
      setState(newState);
  };

  var onRadioSelect = (event:any, data: any) => {
      console.log("(Chart)got select...", event, data);
      if(data && data.interval !== null){
          tradeInfo.currentInterval = data.interval;
          setKlineInterval(data.interval as KlineInterval);
      }
  }
  var radiosSelects: IRadioSelectItem[] = [
      {component: "1m", data:  {interval:KlineInterval.OneMinute}},
      {component: "15m", data: {interval:KlineInterval.FifteenMinutes}},
      {component: "1h", data:  {interval:KlineInterval.OneHour}},
      {component: "1d", data:  {interval:KlineInterval.OneDay}},
      {component: "1M", data:  {interval:KlineInterval.OneMonth}},
  ];

  var currentInterval = tradeInfo.currentInterval;

  var findRadioItem: any = radiosSelects.find(i => i.data.klineInterval == currentInterval);
  var defaultSelection:IRadioSelectItem =  (findRadioItem==null) ? radiosSelects[0] :findRadioItem;
  //var defaultSelection = findRadioItem.length > 0 ? findRadioItem[0].data.interval : KlineInterval.OneDay;

  var selectStyle = {
    backgroundColor: "#333",
    color:"#fff",
  };

  const findFunc = (si: any) => {
    console.log("got find funciton",si);
    //return true;
    return si.data.interval == tradeInfo.currentInterval;
  };
  
  console.log(" ---preview rerender...", state)

  return (<div>
    <h3>{name}</h3>
    <h4>{symbol} </h4>
    <div>
      <button onClick={() => setKlineInterval(KlineInterval.OneMinute)}>1m</button> 
      <button onClick={() => setKlineInterval(KlineInterval.FifteenMinutes)}>15m</button> 
      <button onClick={() => setKlineInterval(KlineInterval.OneHour)}>1h</button> 
      <button onClick={() => setKlineInterval(KlineInterval.OneDay)}>1d</button> 
      <button onClick={() => setKlineInterval(KlineInterval.OneMonth)}>1M</button> 
    </div>
    <ChartTest 
        symbol={symbol}        
        //setStateSetter={chartStateSet}
        //update={getInnerState}
        //update={setTest}
        update = {chartStateNew.getOnStateCreate()}
      />
      <RadioSelect 
        selectItems={radiosSelects} 
        defaultSelection={defaultSelection}
        onSelect = {onRadioSelect}
        selectStyle = {selectStyle}
        findFunc = {findFunc}
      />
    </div>
  );

};



const apiUrl = `http://localhost:5000/`;






export const App = () => {
  //useQuery()

  //const [tradeLookup, setTradeLookup] = useState<TradeLookup>();

  //const [state, setState] = useState({});

  let pairPreviewState = new InnerState();

  const tradeInfo = useTradeInfo();

  const onListingSelect = (instrPair: InstrumentPairStat) =>{
    console.log("instrPair?", instrPair);

    
    if(instrPair != null && instrPair.symbol != null){
      //setChartState({symbol: instrPair.symbol});    
      tradeInfo.currentPair = instrPair;


      
      const newPairPreviewState: ISymbolPairPreviewState = {
        instrumentPair: instrPair, 
        klineInterval: KlineInterval.OneDay,
        symbol: "",
      };
      pairPreviewState.setState(newPairPreviewState);
      //pairPreviewState.setState({symbol: instrPair.symbol, timeSeries:[]});
      //setChartState()
    }
  };

  // let setChartState = (newState: any) =>{};

  // var chartStateSet = (setState: any) => {//deprecate
  //   console.log("got set state", setState);
  //   setChartState = setState;
  // };
  


  

  // let setChartState = (newState: any)  => {
  //   console.log("(App) got inner setState invoke", newState);
  //   setChartStateAux(newState);
  // };
  //let [pairPreviewState, setPairPreviewState] = [null, (newState:any)=>{}];
  // const getInnerState = (innerState: any[]) => {
  //   chartState = innerState[0];
  //   setChartState = innerState[1];
  // };

  // var setChartState = (setState: any) => {
  //   //console.log("got set state", setState);
  //   //setChartState = setState;
    
  // };

  //const [selectedPair, setSelectedPair ] = useState<string>();

  



  // var setTest = (newState: any) =>{ 
  //   chartStateNew.onStateCreate(newState);
  // };
  // let ChartElement = <> </>;
  //if(selectedPair != null)  ChartElement = <ChartTest symbol={""} setStateSetter={chartStateSet}/>
  //ChartElement

  //let ticker = indicators.ticker("binance", "BTC/USDT", true);
  // var setChartUpdate = (updateFunc) => { 

    var onRadioSelect = (event:any, data: any) =>{
      console.log("(App)got select...", event, data);
    }
    var radiosSelects: IRadioSelectItem[] = [
      {component: "A", data: {a:"A"}},
      {component: "B", data: {a:"B"}},
      {component: "C", data: {a:"C"}},
      {component: "D", data: {a:"D"}}
    ];
  // };
    var selectStyle = {
      backgroundColor: "#333",
      color:"#fff",
    }

    return (
      <>
        <RadioSelect 
          selectItems={radiosSelects} 
          defaultSelection={radiosSelects[0]}
          onSelect = {onRadioSelect}
          selectStyle = {selectStyle}
        />
        <SymbolPairPreview setOnStateCreate={pairPreviewState.getOnStateCreate()}/>
        {/* <ChartTest 
          symbol={""}
          //setStateSetter={chartStateSet}
          //update={getInnerState}
          //update={setTest}
          update = {pairPreviewState.getOnStateCreate()}
        /> */}
        <PairListing onSelect={onListingSelect}/>
        
        <PaginatorTest/>
        <FindHighlight text="abcdhjkabcjklaba" match="a"/>
        <Accordian subComponent={"that"}>
          this
        </Accordian>




      </>
    )
  }