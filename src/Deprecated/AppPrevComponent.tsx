import { Accordian, FindHighlight } from "./App";



const apiUrl = `http://localhost:5000/`;


const AppPrev = () => {
  
  const getCoins = async() => {
    const endPoint = `${apiUrl}${"coins"}`; 
    //console.log("endPoint:", endPoint);
    const response = await axios.get<ICoinResponse[]>(endPoint);
    if (response.status == 200) {
      //return response.data;
      //console.log("resp:", response.data);
      return response.data;
    }
    throw new Error(response.status.toString());
    //console.log("resp:", response);

  }

  const getMarginPairs = async() => {
    const endPoint = `${apiUrl}${"pairs"}`; 
    //console.log("endPoint:", endPoint);
    const response = await axios.get<IMarginPairResponse[]>(endPoint);
    if (response.status == 200) {
      //return response.data;
      //console.log("resp:", response.data);
      return response.data;
    }
    throw new Error(response.status.toString());
    //console.log("resp:", response);

  }
  const getSymbols = async() => {
    const endPoint = `${apiUrl}${"exchange_info"}`; 
    //console.log("endPoint:", endPoint);
    const response = await axios.get<IExchangeInfo>(endPoint);
    if (response.status == 200) {
      //return response.data;
      //console.log("resp:", response.data);
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

      //console.log("set")
      
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
    //console.log("got coinSymbolLookup");
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

  return (<div>
          <h1>Crypocurrency listing</h1>
          <input onInput={onInput}/>
          <ul>
            { symbolsListing.map(l=>l.component) }
          </ul>
    </div>);
};