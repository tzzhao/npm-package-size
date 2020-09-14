import {Button, TextField} from '@material-ui/core';
import React from 'react';

type SearchProperties = {
  onSearch: Function;
};

export const Search: React.FC<SearchProperties> = (props) => {
  const initialPackage: string = 'react';
  const [state, setState] = React.useState({
    packageName: initialPackage
  });
  const handleChange: any = (event: React.FormEvent<HTMLInputElement>) => {
    setState({packageName: event.currentTarget.value});
  };

  return (
      <form>
        <div className="search-container">
          <TextField className="search-text-field" required id="package-field" label="Package name" defaultValue={initialPackage} onChange={handleChange}/>
          <Button className="search-submit" variant="outlined" color="primary" disableElevation onClick={() => props.onSearch(state.packageName)}>
            Search
          </Button>
        </div>
      </form>
      );
};


