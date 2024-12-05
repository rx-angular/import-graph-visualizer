import { LinearProgress } from '@material-ui/core';
import { ICruiseResult } from 'dependency-cruiser';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useFilters } from '../hooks/filters';
import { parseModuleDeps } from '../utils/parsers';
import ControlPanel from './ControlPanel';
import DepGraph from './DepGraph';

const JSON_URL =
  process.env.NODE_ENV === 'production'
    ? '/assets/reporter-output.json'
    : '../../../dist/cli/reporter-output.json';

const App: FC = () => {
  const [data, setData] = useState<ICruiseResult>();
  const [physicsSimulation, setPhysicsSimulation] = useState(true);

  const moduleDeps = useMemo(() => data && parseModuleDeps(data), [data]);

  useEffect(() => {
    fetch(JSON_URL)
      .then(response => response.json())
      .then(json => {
        setData(json);
      });
  }, []);

  const [filters, setFilters] = useFilters();

  if (moduleDeps == null) {
    return <LinearProgress />;
  }

  return (
    <>
      <ControlPanel
        moduleDeps={moduleDeps}
        filters={filters}
        onSubmit={setFilters}
        physicsSimulation={physicsSimulation}
        setPhysicsSimulation={setPhysicsSimulation}
      />
      <DepGraph
        moduleDeps={moduleDeps}
        filters={filters}
        physicsSimulation={physicsSimulation}
      />
    </>
  );
};

export default App;
