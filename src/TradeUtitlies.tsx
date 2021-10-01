
import { IInstrument, IInstrumentPair } from "./PairListing";



import React, { Component, useContext } from "react";

export const TradeInfoContext = React.createContext({});

const tradeInfoData = {



};

//@ts-ignore
window.TradeInfoContext = TradeInfoContext;

export interface ITradeInfoProviderState{
    //setState:(newState: ITradeInfoProviderState) => void
    tradeLookup:ITradeLookup
    currentPair: InstrumentPairStat | null
    currentInterval: KlineInterval

}

export class TradeInfoProvider extends Component {

    setProviderState(newState: ITradeInfoProviderState){
        var curState = {
            ...newState
        };
        //this.setState(newState)
    } 

    state: ITradeInfoProviderState = {
        //setState: (newState: ITradeInfoProviderState) => this.setState(newState),
        tradeLookup: {
            pairs: null,
            symbols: null,
        },
        currentPair: null,
        currentInterval: KlineInterval.OneDay
    };
    //  = {
    //     cars: {
    //         car001: { name: 'Honda', price: 100 },
    //         car002: { name: 'BMW', price: 150 },
    //         car003: { name: 'Mercedes', price: 200 }
    //     }
    // };

    //tradeLookup:ITradeLookup;

    

    constructor(props: any){
        super(props);
        // this.tradeLookup = {
        //     pairs:null,
        //     symbols: null,
        // };

    }

    render() {
        return (
            <TradeInfoContext.Provider
                value={this.state}
            >
                {this.props.children}
            </TradeInfoContext.Provider>
        );
    }
}



export function useTradeInfo(){
    const context: ITradeInfoProviderState =  useContext(TradeInfoContext);
    return context;
    //return [context, (ctx: ITradeInfoProviderState) => context.setState(ctx)];
}


export enum KlineInterval{
    OneMinute = 0,
    ThreeMinutes = 1,
    FiveMinutes = 2,
    FifteenMinutes = 3,
    ThirtyMinutes = 4,
    OneHour = 5,
    TwoHour = 6,
    FourHour = 7,
    SixHour = 8,
    EightHour = 9,
    TwelveHour = 10,
    OneDay = 11,
    ThreeDay = 12,
    OneWeek = 13,
    OneMonth = 14
};

export type INumberMap<TValue> = {
    [key: number]: TValue;
}
export type IStringMap<TValue> = {
    [key: string]: TValue;
}

const intervalMapToString: INumberMap<string> = {};
const intervalMapToEnum: IStringMap<KlineInterval> = {};

export const IntervalTo = {
    enum: (intervalString: string) => intervalMapToEnum[intervalString],
    string: (intervalEnum: KlineInterval) => intervalMapToString[intervalEnum],
}

intervalMapToString[KlineInterval.OneMinute] = "ONE_MINUTE";
intervalMapToString[KlineInterval.ThreeMinutes] = "THREE_MINUTES";
intervalMapToString[KlineInterval.FiveMinutes] = "FIVE_MINUTES";
intervalMapToString[KlineInterval.FifteenMinutes] = "FIFTEEN_MINUTES";
intervalMapToString[KlineInterval.ThirtyMinutes] = "THIRTY_MINUTES";
intervalMapToString[KlineInterval.OneHour] = "ONE_HOUR";
intervalMapToString[KlineInterval.TwoHour] = "TWO_HOUR";
intervalMapToString[KlineInterval.FourHour] = "FOUR_HOUR";
intervalMapToString[KlineInterval.SixHour] = "SIX_HOUR";
intervalMapToString[KlineInterval.EightHour] = "EIGHT_HOUR";
intervalMapToString[KlineInterval.TwelveHour] = "TWELVE_HOUR";
intervalMapToString[KlineInterval.OneDay] = "ONE_DAY";
intervalMapToString[KlineInterval.ThreeDay] = "THREE_DAY";
intervalMapToString[KlineInterval.OneWeek] = "ONE_WEEK";
intervalMapToString[KlineInterval.OneMonth] = "ONE_MONTH";

intervalMapToEnum["ONE_MINUTE"] = KlineInterval.OneMinute;
intervalMapToEnum["THREE_MINUTES"] = KlineInterval.ThreeMinutes;
intervalMapToEnum["FIVE_MINUTES"] = KlineInterval.FiveMinutes;
intervalMapToEnum["FIFTEEN_MINUTES"] = KlineInterval.FifteenMinutes;
intervalMapToEnum["THIRTY_MINUTES"] = KlineInterval.ThirtyMinutes;
intervalMapToEnum["ONE_HOUR"] = KlineInterval.OneHour;
intervalMapToEnum["TWO_HOUR"] = KlineInterval.TwoHour;
intervalMapToEnum["FOUR_HOUR"] = KlineInterval.FourHour;
intervalMapToEnum["SIX_HOUR"] = KlineInterval.SixHour;
intervalMapToEnum["EIGHT_HOUR"] = KlineInterval.EightHour;
intervalMapToEnum["TWELVE_HOUR"] = KlineInterval.TwelveHour;
intervalMapToEnum["ONE_DAY"] = KlineInterval.OneDay;
intervalMapToEnum["THREE_DAY"] = KlineInterval.ThreeDay;
intervalMapToEnum["ONE_WEEK"] = KlineInterval.OneWeek;
intervalMapToEnum["ONE_MONTH"] = KlineInterval.OneMonth;


export const IntervalToString = (interval: KlineInterval) => {

};
//const value = useContext(TradeInfoContext);


export class InstrumentStat{
    symbol: string;
    name: string;
    instrumentData: IInstrument;
    
    constructor(instrument: IInstrument){
        this.instrumentData = instrument;
        this.symbol = instrument.symbol;
        this.name = instrument.name;
    }
  
  }
  
  export class InstrumentPairStat{
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
      this.baseInstrument = baseInstrument;
      this.quoteInstrument = quoteInstrument;


      this.name = this.getName();
  

  
      this.symbol = instrumentPair.symbol;
    }
  }
  
export type ILookup<T> = {
    [key: string]: string | T;
}
  
  export interface ITradePairLookUp{
    pairs:ILookup<InstrumentPairStat>;
  }
  export interface ITradeSymbolLookUp{
    symbols:ILookup<InstrumentStat>;
  }
  
  export interface ITradeLookup{
    pairs: ITradePairLookUp | null;
    symbols: ITradeSymbolLookUp | null;
  }
  
  /* 
  USE CASE:

  const tradeLookup: ITradeLookup = {
    pairs: null,
    symbols: null,
  };
  
  */
