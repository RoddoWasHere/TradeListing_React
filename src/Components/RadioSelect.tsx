import { CSSProperties, useState } from "react";

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
    className?: string
}

export interface IRadioSelectState{
    current: IRadioSelectItem
    prev: IRadioSelectItem
}
  
  
 export const RadioSelect = (props: IRadioSelectProps) => {
    const [state, setState] = useState<IRadioSelectState>({
        current: props.defaultSelection,
        prev: null as any,
    });

  
    const getRadioItem = (radioSelectItem: IRadioSelectItem, key: string, isSelected?:boolean)=>{//component: React.ReactNode, data: any, onClick: any) => {
        var onClickHere = function(event: any){
            props.onSelect(event, radioSelectItem.data);
            if(radioSelectItem.onClick)
              radioSelectItem.onClick(event, radioSelectItem.data);
      
            setState({current:radioSelectItem, prev: state.current});
        };

        let style = {};
        if(isSelected==true){
            style = props.selectStyle;
        }
    
        var button = <button key={key} style={style} onClick={onClickHere}>{radioSelectItem.component}</button>;  
        
        return button;
    };
  
    var findFunc = props.findFunc == null ? (si:any) =>  (si == state.current) : props.findFunc;

    const className = props.className ? props.className : "";

    return (<div className={className}>
        {props.selectItems.map((si, index: number) => {         
            const isSelected = findFunc? findFunc(si) : false;
            return getRadioItem(si, index+"", isSelected);
        })}
      </div>);
  };