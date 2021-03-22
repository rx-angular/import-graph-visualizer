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

  const [targetModules, setTargetModules] = useState<string[]>(
    filters.targetModules,
  );
  const [sourceModules, setSourceModules] = useState<string[]>(
    filters.sourceModules,
  );

  const targetModulesValue = useMemo(
    () => targetModules.map(path => moduleDeps.modules[path]),
    [targetModules, moduleDeps],
  );
  const sourceModulesValue = useMemo(
    () => sourceModules.map(path => moduleDeps.modules[path]),
    [sourceModules, moduleDeps],
  );

  const handleTargetModulesChange = (modules: Module[]) => {
    setTargetModules(modules.map(({ path }) => path));
  };
  const handleSourceModulesChange = (modules: Module[]) => {
    setSourceModules(modules.map(({ path }) => path));
  };
  const handleSubmit = () => {
    onSubmit?.({ targetModules: targetModules, sourceModules: sourceModules });
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <SelectModules
          modules={modules}
          label="Import target(s)"
          value={targetModulesValue}
          onChange={handleTargetModulesChange}
        />
      </Grid>
      <Grid item>
        <SelectModules
          modules={modules}
          label="Import source(s)"
          value={sourceModulesValue}
          onChange={handleSourceModulesChange}
        />
      </Grid>
      <Button onClick={handleSubmit}>Render</Button>
    </Grid>
  );
};

export default ControlPanel;
