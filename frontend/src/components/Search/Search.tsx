import {Button, TextField, Tooltip} from '@material-ui/core';
import React, {FormEvent} from 'react';

export interface SearchProperties {
  onSearch: (name: string) => void,
  disabled: boolean,
  disabledTooltipMessage: string,
  inputName: string,
  defaultValue: string
}

export const Search: React.FC<Partial<SearchProperties>> = (props: Partial<SearchProperties>) => {
  const [state, setState] = React.useState({
    packageName: props.defaultValue || ''
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
          <TextField className="search-text-field" required label={props.inputName} defaultValue={props.defaultValue} onChange={handleChange}/>
          <Tooltip title={props.disabled ? props.disabledTooltipMessage! : ''}>
            <div className={'search-button-wrapper'}>
              <Button type="submit" className="search-submit" variant="outlined" disabled={props.disabled} color={props.disabled ? undefined : 'primary'}>Search</Button>
            </div>
          </Tooltip>
        </div>
      </form>
      );
};
