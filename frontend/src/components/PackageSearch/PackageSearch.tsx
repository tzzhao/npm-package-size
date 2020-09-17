import React, {FormEvent, useEffect, useState} from 'react';
import {Search} from '../Search/Search';

export interface PackageSearchProperties {
  disabled: boolean,
  disabledTooltipMessage: string,
  inputName: string,
  defaultValue: string,
  onSearch: (packageName: string) => void,
}

export const PackageSearch: React.FC<Partial<PackageSearchProperties>> = ({onSearch, ...props}) => {
  const [searchFieldValue, setSearchFieldValue] = useState<string>(props.defaultValue || '');
  const [debounceTimeoutId, setDebounceTimeoutId] = useState<any>(undefined);
  const [searchSuggestionsCache, setSearchSuggestionsCache] = useState<{[key: string]: string[]}>({});
  const [selectedSearchSuggestions, setSelectedSearchSuggestions] = useState<string>('');
  const [lastAsyncSuggestions, setLastAsyncSuggestions] = useState<string>('');

  const searchOnSubmit = (e?: FormEvent, value?: string) => {
    // Block native form submission
    e && e.preventDefault();
    if (!props.disabled) {
      // the package to search is either the provided value or the search value stored in the state
      const packageToSearch: string = value || searchFieldValue;
      if (onSearch && packageToSearch) onSearch!(packageToSearch);
    }
  };

  // Hook to display the last async suggestion if it is relevant
  useEffect(() => {
    if (lastAsyncSuggestions === searchFieldValue || lastAsyncSuggestions && !searchSuggestionsCache![searchFieldValue!]) {
      setSelectedSearchSuggestions(lastAsyncSuggestions);
      setLastAsyncSuggestions('');
    }
  }, [lastAsyncSuggestions]);

  // Hook to update search suggestions or asynchronously fetch search suggestions when the search input is updated
  useEffect(() => {
    // reset timeout when the user input changes
    if (debounceTimeoutId) clearTimeout(debounceTimeoutId);

    let hasSuggestionsCacheForCurrentSearchValue: boolean = !!searchSuggestionsCache![searchFieldValue];

    // Custom debounce method to fetch most popular packages containing the current search input value
    const timeout = searchFieldValue && !hasSuggestionsCacheForCurrentSearchValue ? setTimeout(()=>{
      fetch(`https://api.npms.io/v2/search/suggestions?q=${searchFieldValue}`)
          .then(response => response.json())
          .then((listSuggestion: any[]) => {
            const listSuggestions: string[] = listSuggestion.map((el: any) => el.package.name as string);
            setSearchSuggestionsCache({...searchSuggestionsCache, [searchFieldValue]: listSuggestions});
            setLastAsyncSuggestions(searchFieldValue);
          })
          .catch(error => console.error(error));
    }, 500) as any : undefined;

    setSelectedSearchSuggestions(hasSuggestionsCacheForCurrentSearchValue ? searchFieldValue : selectedSearchSuggestions);
    setDebounceTimeoutId(timeout);

    return () => {timeout && clearTimeout(timeout);};
  }, [searchFieldValue]);

  const handleChange: any = (inputValue: string) => {
    setSearchFieldValue(inputValue);
  };

  return <Search
      {...props}
      searchOnSubmit={searchOnSubmit}
      handleOnChange={handleChange}
      autocompleteOptions={searchSuggestionsCache![selectedSearchSuggestions!] || []} />;
};
