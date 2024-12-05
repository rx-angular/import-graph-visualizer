import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
} from '@material-ui/core';
import React, { FC, useMemo, useState } from 'react';
import { getModules } from '../utils/deps';
import { Filters, Module, ModuleDeps } from '../utils/types';
import SelectModules from './SelectModules';

type Props = {
  moduleDeps: ModuleDeps;
  filters: Filters;
  onSubmit?: (filters: Filters) => void;
  physicsSimulation: boolean;
  setPhysicsSimulation: (enable: boolean) => void;
};

const ControlPanel: FC<Props> = ({
  moduleDeps,
  filters,
  onSubmit,
  physicsSimulation,
  setPhysicsSimulation,
}) => {
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
    <Card elevation={3}>
      <CardHeader
        title="Import Graph Visualizer"
        titleTypographyProps={{ align: 'center' }}
      />
      <CardContent>
        <Container fixed>
          <Grid container direction="column" spacing={2}>
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
          </Grid>
        </Container>
      </CardContent>
      <CardActions>
        <Grid container justify="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Render
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setPhysicsSimulation(!physicsSimulation)}
            >
              {physicsSimulation ? 'Stop' : 'Start'} physics simulation
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ControlPanel;
