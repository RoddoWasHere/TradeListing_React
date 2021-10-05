
function getIndiciesOf(text: string, find: string){
    let index = 0;
    const indicies = [];
    let rest = text;
    while(index < text.length){
    const found = rest.indexOf(find);
    if(found != -1){      
        indicies.push(index + found);
        index += found + find.length;
        rest = text.substr(index);
    }else 
        return indicies;
    }
    return indicies;
}

function splitAtIndicies(text: string, indicies: number[], length: number) : string[] {//all odd are matches
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


/*
This method will ignore case for finding matches,
but maintian capitalization of the resulting text
*/
function replaceAllIgnoreCase(text: string, find: string, replaceF: (curString: string) => string){
    var textLwr = text.toLowerCase();
    var findLwr = find.toLowerCase();
    var inds = getIndiciesOf(textLwr, findLwr);
    var split = splitAtIndicies(text, inds, find.length);

    for(var a=1; a<split.length; a+=2){
        split[a] = replaceF(split[a]);
    }
    return split.join("");
}

interface IFindHighlightProps{
    text: string
    match: string
    highlightClassName?: string
}

const FindHighlight = (props: IFindHighlightProps) => {
    const text = props.text;
    const match = props.match;

    let txResult = text;
    const className = props.highlightClassName == null ? "" : props.highlightClassName;

    if(match != ""){
        const replaceF = ((found: string) => `<span class=${className} style="background-color:yellow">${found}</span>`);
        txResult = replaceAllIgnoreCase(text, match, replaceF);
    }    

    return (
        <span dangerouslySetInnerHTML={{ __html: txResult }} />
    );
};

export default FindHighlight;