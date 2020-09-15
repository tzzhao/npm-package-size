import {Button, TextField, Tooltip} from '@material-ui/core';
import React, {FormEvent} from 'react';

export interface SearchProperties {
  onSearch: (name: string) => void,
  disabled: boolean
}

export const Search: React.FC<Partial<SearchProperties>> = (props: Partial<SearchProperties>) => {
  const initialPackage = 'react';

  const [state, setState] = React.useState({
    packageName: initialPackage
  });

  const searchOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!props.disabled) {
      if (props.onSearch) props.onSearch!(state.packageName);
    }
  };

  const handleChange: any = (event: React.FormEvent<HTMLInputElement>) => {
    setState({...state, packageName: event.currentTarget.value});
  };

  return (
      <form onSubmit={searchOnSubmit}>
        <div className="search-container">
          <TextField className="search-text-field" required id="package-field" label="Package name" defaultValue={initialPackage} onChange={handleChange}/>
          <Tooltip title={props.disabled ? 'Wait for the current request to end before making a new one' : ''}>
            <div className={'search-button-wrapper'}>
              <Button type="submit" className="search-submit" variant="outlined" disabled={props.disabled} color={props.disabled ? undefined : 'primary'}>Search</Button>
            </div>
          </Tooltip>
        </div>
      </form>
      );
};
