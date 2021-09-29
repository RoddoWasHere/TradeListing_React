
import { IInstrument, IInstrumentPair } from "./PairListing";



import React, { Component, useContext } from "react";

export const TradeInfoContext = React.createContext({});

const tradeInfoData = {



};

interface ITradeInfoProviderState{
    //setState:(newState: ITradeInfoProviderState) => void
    tradeLookup:ITradeLookup
    currentPair: InstrumentPairStat | null

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
    return [context, (ctx: ITradeInfoProviderState) => context.setState(ctx)];
}

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
      
      this.name = this.getName();
  
      this.baseInstrument = baseInstrument;
      this.quoteInstrument = quoteInstrument;
  
      this.symbol = instrumentPair.symbol;
    }
  }
  
export type Lookup<T> = {
    [key: string]: string | T;
}
  
  export interface ITradePairLookUp{
    pairs:Lookup<InstrumentPairStat>;
  }
  export interface ITradeSymbolLookUp{
    symbols:Lookup<InstrumentStat>;
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
