import { CSSProperties, useState } from "react";
import { useTradeInfo } from "./TradeUtitlies";


export interface IRadioSelectItem{
    component: React.ReactNode,
    data: any,
    onClick?: (event: any, data: any) => void,
  }
  
export interface IRadioSelectProps{
    defaultSelection: IRadioSelectItem
    onSelect: (event: any, data: any) => void
    selectItems: IRadioSelectItem[]
    selectStyle: CSSProperties
    findFunc: null | ((itemData: any) => boolean)
}

export interface IRadioSelectState{
    current: IRadioSelectItem
    prev: IRadioSelectItem
    //selectStyle: CSSProperties
}
  
  // class RadioSelectItem {
  //     component: React.ReactNode;
  //     data: any;
  //     onClick?: (event: any, data: any) => void;
  
  //     constructor(
  //         component: React.ReactNode,
  //         data: any, 
  //         onClick?: (event: any, data: any) => void
  //     ){
  //         this.component = component;
  //         this.data = data;
  //         this.onClick = onClick;
  //     }
  // }
  
  export const RadioSelect = (props: IRadioSelectProps) => {
    const [state, setState] = useState<IRadioSelectState>({
      current: props.defaultSelection,
      prev: null as any,
    });
    const onSelect = (event: any) => {
  
    };  

    
  
  
    const getRadioItem = (radioSelectItem: IRadioSelectItem, isSelected?:boolean)=>{//component: React.ReactNode, data: any, onClick: any) => {
      //var self = 
      var onClickHere = function(event: any){
        console.log("got data", radioSelectItem.data, event);
        props.onSelect(event, radioSelectItem.data);
        if(radioSelectItem.onClick)
          radioSelectItem.onClick(event, radioSelectItem.data);
  
        setState({current:radioSelectItem, prev: state.current});
      };


      let style = {};
      if(isSelected==true){
        // style = {
        //   backgroundColor:"blue",
        // };
        console.log("GOT SELECTION");
        style = props.selectStyle;
      }
  
      var button = <button style={style} onClick={onClickHere}>{radioSelectItem.component}</button>;
  
      
      return button;
    };
  
    console.log("got rerender:(state, props)", state, props);

    var findFunc = props.findFunc == null ? (si:any) =>  (si == state.current) : props.findFunc;

    // var findFunc = (si: any) => {
    //     console.log("find F ", si, state.current, (si == state.current));
    //     return (si == state.current);
    // };

    //@ts-ignore
    window.findFunc = findFunc;

    return (<div>
        {props.selectItems.map(si => {
          //const isSelected = (si == state.current);
          
          const isSelected = findFunc? findFunc(si) : false;
          console.log("has find function", props,"\n--" ,si==state.current, si.data, isSelected);
          return getRadioItem(si, isSelected);
        })}
      </div>);
  };