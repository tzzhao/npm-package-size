import {Button, TextField, Tooltip} from '@material-ui/core';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {PackageState, RootState} from '../../store/state';

export interface SearchProperties {
  onSearch: Function,
  state: PackageState
}

const emptyFunction = () => {};

export const SearchNotConnected: React.FC<Partial<SearchProperties>> = (props) => {
  const initialPackage: string = 'react';

  const [state, setState] = React.useState({
    packageName: initialPackage,
    searchDisabled: false
  });

  const onSearch = () => props.onSearch(state.packageName);

  const handleChange: any = (event: React.FormEvent<HTMLInputElement>) => {
    setState({...state, packageName: event.currentTarget.value});
  };

  useEffect(() => {
    if (props.state === PackageState.LOADING) {
      if (!state.searchDisabled) setState({...state, searchDisabled: true});
    } else if (props.state !== PackageState.LOADING && state.searchDisabled) {
      setState({...state, searchDisabled: ''});
    }
  });

  return (
      <form>
        <div className="search-container">
          <TextField className="search-text-field" required id="package-field" label="Package name" defaultValue={initialPackage} onChange={handleChange}/>
          {!state.searchDisabled
              ? <Button className="search-submit" variant="outlined" color="primary" onClick={onSearch}>Search</Button>
              : <Tooltip title="Wait for the current request to end before making a new one">
                <span>
                  <Button className="search-submit" variant="outlined" disabled onClick={emptyFunction}>Search</Button>
                </span>
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
