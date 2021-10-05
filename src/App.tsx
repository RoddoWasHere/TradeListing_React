import './styles.css';
import PairListing from './Components/PairListing';
import { InstrumentPairStat, KlineInterval, useTradeInfo } from './Utilities/TradeUtitlies';

import { ISymbolPairPreviewState, SymbolPairPreview } from './Components/SymbolPairPreview';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { InnerState } from './Utilities/ReactUtilites';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchTextInput from './Components/SearchTextInput';


export const App = () => {

    const pairPreviewState = new InnerState();
    const pairListingState = new InnerState();

    const tradeInfo = useTradeInfo();

    const onListingSelect = (instrPair: InstrumentPairStat) =>{
      
        if(instrPair != null && instrPair.symbol != null){
    
            tradeInfo.currentPair = instrPair;
            
            const newPairPreviewState: ISymbolPairPreviewState = {
                instrumentPair: instrPair, 
                klineInterval: KlineInterval.OneDay,
                symbol: "BTCUSDT",
            };
            pairPreviewState.setState(newPairPreviewState);
        }
    };

    const onSearchInput = (event: any, value: any) => {
        var value = event.target.value;
        var newState = { ...pairListingState.state }; 
        newState.searchText = value;
        pairListingState.setState(newState);      
    };

    return (
        <>
            <div className={"section"}>
                <h1>Cryptocurrency Trade Listing</h1>
            </div>        
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}           
                >Symbol Pair Details</AccordionSummary>  
                <AccordionDetails>
                    <SymbolPairPreview setOnStateCreate={pairPreviewState.getOnStateCreate()}/>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >Symbol Pairs</AccordionSummary>  
                <AccordionDetails>
                    <SearchTextInput onInput={onSearchInput}/>
                    <PairListing onSelect={onListingSelect} setOnStateCreate={pairListingState.getOnStateCreate()}/>      
                </AccordionDetails>
            </Accordion>
        </>
    )
  }