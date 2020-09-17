import {Button, TextField, Tooltip} from '@material-ui/core';
import {Autocomplete, AutocompleteRenderInputParams} from '@material-ui/lab';
import React, {FormEvent} from 'react';

export interface SearchProperties {
  disabled: boolean,
  disabledTooltipMessage: string,
  inputName: string,
  defaultValue: string,
  autocompleteOptions: string[],
  searchOnSubmit: (event?: FormEvent, searchValue?: string) => void,
  handleOnChange: (inputValue: string) => void
}

export const Search: React.FC<Partial<SearchProperties>> = (props: Partial<SearchProperties>) => {
  const handleChange: any = (event: React.FormEvent<HTMLInputElement>, value: string, reason: string) => {
    props.handleOnChange!(value);
    // In case the user selects an option in the dropdown (the check on event is to prevent call at page load)
    if (reason === 'reset' && event) {
      props.searchOnSubmit!(event, value);
    }
  };

  return (
      <form onSubmit={props.searchOnSubmit}>
        <div className="search-container">
          <div className="search-text-field">
            <Autocomplete
                freeSolo
                disableClearable
                defaultValue={props.defaultValue}
                options={props.autocompleteOptions!}
                onInputChange={handleChange}
                renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField {...params} required  label={props.inputName} />
                )}
            />
          </div>
          <Tooltip title={props.disabled ? props.disabledTooltipMessage! : ''}>
            <div className={'search-button-wrapper'}>
              <Button type="submit" className="search-submit" variant="outlined" disabled={props.disabled} color={props.disabled ? undefined : 'primary'}>Search</Button>
            </div>
          </Tooltip>
        </div>
      </form>
      );
};
