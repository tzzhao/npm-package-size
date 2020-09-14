import {Button, TextField, Tooltip} from '@material-ui/core';
import React, {FormEvent, useEffect} from 'react';
import {connect} from 'react-redux';
import {PackageState, RootState} from '../../store/state';

export interface SearchProperties {
  onSearch: Function,
  state: PackageState
}

const preventFormSubmitFunction = (e: FormEvent) => {e.preventDefault();};

export const SearchNotConnected: React.FC<Partial<SearchProperties>> = (props: Partial<SearchProperties>) => {
  const initialPackage: string = 'react';

  const [state, setState] = React.useState({
    packageName: initialPackage,
    searchDisabled: false
  });

  const searchOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.onSearch!(state.packageName);};

  const handleChange: any = (event: React.FormEvent<HTMLInputElement>) => {
    setState({...state, packageName: event.currentTarget.value});
  };

  useEffect(() => {
    if (props.state === PackageState.LOADING) {
      if (!state.searchDisabled) setState({...state, searchDisabled: true});
    } else if (state.searchDisabled) {
      setState({...state, searchDisabled: false});
    }
  });

  return (
      <form onSubmit={state.searchDisabled ? preventFormSubmitFunction : searchOnSubmit}>
        <div className="search-container">
          <TextField className="search-text-field" required id="package-field" label="Package name" defaultValue={initialPackage} onChange={handleChange}/>
          {!state.searchDisabled
              ? <Button type="submit" className="search-submit" variant="outlined" color="primary">Search</Button>
              : <Tooltip title="Wait for the current request to end before making a new one">
                <div className="disabled-search">
                  <Button type="submit" className="search-submit" variant="outlined" disabled>Search</Button>
                </div>
              </Tooltip>
          }

        </div>
      </form>
      );
};

const mapStateToSearchErrorProps = (state: RootState) => {
  return {
    state: state.state
  };
};

export const Search = connect(mapStateToSearchErrorProps)(SearchNotConnected);
