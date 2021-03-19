import { TextField } from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  FilterOptionsState,
} from '@material-ui/lab';
import { matchSorter } from 'match-sorter';
import React, { FC } from 'react';
import { Module } from '../utils/types';

type Props = {
  modules: Module[];
  label: string;
};

const SelectModules: FC<Props> = ({ modules, label }) => {
  const filterOptions = (
    options: Module[],
    { inputValue }: FilterOptionsState<Module>,
  ) =>
    matchSorter(options, inputValue, {
      keys: [({ path }) => path.replace(/\/_-\./g, ' ')],
    });
  const getOptionLabel = ({ path }: Module) => path;
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField {...params} label={label} variant="outlined" />
  );

  return (
    <Autocomplete
      multiple
      options={modules}
      getOptionLabel={getOptionLabel}
      renderInput={renderInput}
      filterOptions={filterOptions}
    />
  );
};

export default SelectModules;
