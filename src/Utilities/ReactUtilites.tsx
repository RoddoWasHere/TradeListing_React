import { CSSProperties } from "react";


export class InnerState{
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
        //console.log("onStateCreate?", newStateSet[0], newStateSet[1]);
        var newState = newStateSet[0];
        
        //this.object.state = 2;
        this.state = newStateSet[0];
        this.setState = newStateSet[1];
    };
   
};
