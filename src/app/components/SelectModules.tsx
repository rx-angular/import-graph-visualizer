import { TextField } from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  FilterOptionsState,
} from '@material-ui/lab';
import { matchSorter } from 'match-sorter';
import React, { ChangeEvent, FC } from 'react';
import { Module } from '../utils/types';

type Props = {
  modules: Module[];
  label: string;
  value?: Module[];
  onChange?: (modules: Module[]) => void;
};

const SelectModules: FC<Props> = ({ modules, label, value, onChange }) => {
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
  const handleChange = (_: ChangeEvent<{}>, value: Module[]) => {
    onChange?.(value);
  };
  const areModulesEqual = (option: Module, value: Module) =>
    option.path === value.path;

  return (
    <Autocomplete
      multiple
      options={modules}
      value={value}
      getOptionLabel={getOptionLabel}
      renderInput={renderInput}
      filterOptions={filterOptions}
      onChange={handleChange}
      getOptionSelected={areModulesEqual}
    />
  );
};

export default SelectModules;
