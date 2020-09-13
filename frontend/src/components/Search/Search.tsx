import {Button, TextField} from '@material-ui/core';
import React from 'react';

type SearchProperties = {
  onSearch: Function;
};

export const Search: React.FC<SearchProperties> = (props) => {
  const [state, setState] = React.useState({
    packageName: ''
  });
  const handleChange: any = (event: React.FormEvent<HTMLInputElement>) => {
    setState({packageName: event.currentTarget.value});
  };

  return (
      <form>
        <div>
          <TextField required id="package-field" label="Package name" defaultValue="Hello World" onChange={handleChange}/>
          <Button variant="outlined" color="primary" disableElevation onClick={props.onSearch(state.packageName)}>
            Search
          </Button>
        </div>
      </form>
      );
};


