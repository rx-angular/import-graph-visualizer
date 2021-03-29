import { Grid, Icon, TextField, Typography } from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  FilterOptionsState,
} from '@material-ui/lab';
import { matchSorter } from 'match-sorter';
import React, { ChangeEvent, FC } from 'react';
import { dirnameFromPath, filenameFromPath } from '../utils/format';
import { getIconUrlForPath } from '../utils/icons';
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
  const renderOption = (option: Module) => (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Icon fontSize="small" style={{ textAlign: 'center' }}>
          <img
            src={getIconUrlForPath(option.path)}
            style={{ display: 'flex', height: 'inherit', width: 'inherit' }}
          />
        </Icon>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1">
          {filenameFromPath(option.path)}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2">{dirnameFromPath(option.path)}</Typography>
      </Grid>
    </Grid>
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
      renderOption={renderOption}
      filterOptions={filterOptions}
      onChange={handleChange}
      getOptionSelected={areModulesEqual}
    />
  );
};

export default SelectModules;
