import { LinearProgress } from '@material-ui/core';
import { ICruiseResult } from 'dependency-cruiser';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useFilters } from '../hooks/filters';
import { parseModuleDeps } from '../utils/parsers';
import ControlPanel from './ControlPanel';
import DepGraph from './DepGraph';

const JSON_URL =
  process.env.NODE_ENV === 'production'
    ? '../cli/reporter-output.json'
    : '../../../dist/cli/reporter-output.json';

const App: FC = () => {
  const [filters, setFilters] = useFilters();
  const [data, setData] = useState<ICruiseResult>();

  const moduleDeps = useMemo(() => data && parseModuleDeps(data), [data]);

  useEffect(() => {
    fetch(JSON_URL)
      .then(response => response.json())
      .then(json => {
        setData(json);
      });
  }, []);

  if (moduleDeps == null) {
    return <LinearProgress />;
  }

  return (
    <>
      <ControlPanel
        moduleDeps={moduleDeps}
        filters={filters}
        onSubmit={setFilters}
      />
      <DepGraph moduleDeps={moduleDeps} filters={filters} />
    </>
  );
};

export default App;
