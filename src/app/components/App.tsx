import { ICruiseResult } from 'dependency-cruiser';
import React, { FC, useEffect, useState } from 'react';
import { createDepGraph, getModules } from '../utils/deps';
import { parseModuleDeps } from '../utils/parsers';
import { Module } from '../utils/types';
import DepGraph from './DepGraph';
import SelectModules from './SelectModules';

const JSON_URL =
  process.env.NODE_ENV === 'production'
    ? '../cli/reporter-output.json'
    : '../../../dist/cli/reporter-output.json';

const App: FC = () => {
  const [data, setData] = useState<ICruiseResult>();
  const [rootModules, setRootModules] = useState<string[]>([]);
  const [leafModules, setLeafModules] = useState<string[]>([]);

  useEffect(() => {
    fetch(JSON_URL)
      .then(response => response.json())
      .then(json => {
        setData(json);
      });
  }, []);

  if (data == null) {
    return <em>Loading...</em>;
  }

  const handleRootModulesChange = (modules: Module[]) => {
    setRootModules(modules.map(({ path }) => path));
  };
  const handleLeafModulesChange = (modules: Module[]) => {
    setLeafModules(modules.map(({ path }) => path));
  };

  const moduleDeps = parseModuleDeps(data);
  const modules = getModules(moduleDeps);
  const graph = createDepGraph({
    moduleDeps,
    rootModules,
    leafModules,
  });

  return (
    <div>
      <SelectModules
        modules={modules}
        label="Root module(s)"
        onChange={handleRootModulesChange}
      />
      <SelectModules
        modules={modules}
        label="Leaf module(s)"
        onChange={handleLeafModulesChange}
      />
      <DepGraph graph={graph} />
    </div>
  );
};

export default App;
