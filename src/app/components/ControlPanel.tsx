import { Button, Grid } from '@material-ui/core';
import React, { FC, useMemo, useState } from 'react';
import { getModules } from '../utils/deps';
import { Filters, Module, ModuleDeps } from '../utils/types';
import SelectModules from './SelectModules';

type Props = {
  moduleDeps: ModuleDeps;
  filters: Filters;
  onSubmit?: (filters: Filters) => void;
};

const ControlPanel: FC<Props> = ({ moduleDeps, filters, onSubmit }) => {
  const modules = useMemo(() => getModules(moduleDeps), [moduleDeps]);

  const [rootModules, setRootModules] = useState<string[]>(filters.rootModules);
  const [leafModules, setLeafModules] = useState<string[]>(filters.leafModules);

  const rootModulesValue = useMemo(
    () => rootModules.map(path => moduleDeps.modules[path]),
    [rootModules, moduleDeps],
  );
  const leafModulesValue = useMemo(
    () => leafModules.map(path => moduleDeps.modules[path]),
    [leafModules, moduleDeps],
  );

  const handleRootModulesChange = (modules: Module[]) => {
    setRootModules(modules.map(({ path }) => path));
  };
  const handleLeafModulesChange = (modules: Module[]) => {
    setLeafModules(modules.map(({ path }) => path));
  };
  const handleSubmit = () => {
    onSubmit?.({ rootModules, leafModules });
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <SelectModules
          modules={modules}
          label="Root module(s)"
          value={rootModulesValue}
          onChange={handleRootModulesChange}
        />
      </Grid>
      <Grid item>
        <SelectModules
          modules={modules}
          label="Leaf module(s)"
          value={leafModulesValue}
          onChange={handleLeafModulesChange}
        />
      </Grid>
      <Button onClick={handleSubmit}>Draw graph</Button>
    </Grid>
  );
};

export default ControlPanel;
