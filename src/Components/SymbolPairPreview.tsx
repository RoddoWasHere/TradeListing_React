import '../styles.css';
import { useState } from 'react';
import { Chart, IChartState } from "./Chart";
import { InstrumentPairStat, ITradeInfoProviderState, KlineInterval, useTradeInfo } from '../Utilities/TradeUtitlies';
import { IRadioSelectItem, RadioSelect } from './RadioSelect';
import { InnerState } from '../Utilities/ReactUtilites';

export interface ISymbolPairPreviewProps{
    instrumentPair?: InstrumentPairStat
    setOnStateCreate: any
}
  
export interface ISymbolPairPreviewState{
    symbol: string
    instrumentPair?: InstrumentPairStat
    klineInterval: KlineInterval
}
  
 export const SymbolPairPreview = (props: ISymbolPairPreviewProps) => {
    
    const tradeInfo: ITradeInfoProviderState = useTradeInfo();
  
    let chartState = new InnerState();
    const [state, setStateAux] = useState<ISymbolPairPreviewState>({
        klineInterval: KlineInterval.OneDay,
        instrumentPair: props.instrumentPair,
        symbol:"",
    });
    const setState = (newState: ISymbolPairPreviewState) =>{
      const symbol = newState.instrumentPair ? newState.instrumentPair.symbol : "";
  
      const newChartState: IChartState = {
        symbol: symbol,
        klineInterval: newState.klineInterval,
        timeSeries:[]
      }
      chartState.setState(newChartState);

      setStateAux(newState);
    }
    props.setOnStateCreate([state, setState]);
  
    const name = state.instrumentPair ? state.instrumentPair.name : "";
    const symbol = state.instrumentPair ? state.instrumentPair.symbol : "(Select an instrument pair to preview the information)";
  
    const setKlineInterval = (newInterval: KlineInterval) => {
        
        var newState = {...state};
        newState.klineInterval = newInterval;
        setState(newState);
    };
  
    var onRadioSelect = (event:any, data: any) => {
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
  
    var selectStyle = {
      backgroundColor: "#eee",
      color:"black",
    };
  
    const findFunc = (si: any) => {
      return si.data.interval == tradeInfo.currentInterval;
    };
    
    return (<div className={"pairPreview"}>
        <div>  
            <h2>{name}</h2>
            <h4>{symbol} </h4>
            <Chart 
                symbol={symbol}        
                update = {chartState.getOnStateCreate()}
            />
            <RadioSelect 
                selectItems={radiosSelects} 
                defaultSelection={defaultSelection}
                onSelect = {onRadioSelect}
                selectStyle = {selectStyle}
                findFunc = {findFunc}
                className = {"radioSelect"}
            />
        </div>
      </div>
    );
  
  };
  