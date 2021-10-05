# Trade Listing React Application
_____________________

## Setup

From the terminal/command-line run: `npm i` to install all required packages

To run the application run `npm start` which should provide the local url, typically on port 8080

## Architecure

### Stack overview
- React
- Typescript
- Apollo-client (for graphQL)
- Material UI
- ...

### Fetching data
On starting, the application fetches the basic info for all the symbol pairs with a GraphQL query (minimal payload). This allows for filtering results quickly using the search box and potentially filtering. It then lazy loads data relating to a particular symbol pair when it's selected.

### Components

- SymbolPairPreview

    Shows a preview of the currently selected symbol pair (chart + name)

- PairListing

    Shows a paginated listing of all the symbol pairs available + a search box

- Chart

    Candle chart (or other) of currently selected symbol pair

- SearchTextInput

    Text input with magnifying glass icon for searching

- FindHighlight

    Highlight text within itself according to the match prop 

- RadioSelect

    Like a radio button selection (i.e. only one selection) with styling (for the time interval selection)


### Utilities

- InnerState

    Used mainly to set the state of a sub-component

- TradeInfoProvider (deprecated)

    Used to provide a React context for shared properties (should rather have been a InstrumentPairProvider perhaps)

- InstrumentStat / InstrumentPairStat

    Used to convert data from the API to useful information and link data to UI list items
