import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


const SearchTextInput = (props: any) => {
    return (
        <Paper
            className={"searchField"}
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Instrument Pairs"
                onInput={props.onInput}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon/>
            </IconButton>
        </Paper>
    );
};

export default SearchTextInput;