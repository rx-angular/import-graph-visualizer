import React, { FC, useEffect, useMemo, useRef } from 'react';
import { Edge, Network, Node } from 'vis-network/standalone';
import { filenameFromPath } from '../utils/format';
import { createDepGraph } from '../utils/graph';
import { DepGraph, Filters, ModuleDeps } from '../utils/types';

type Props = {
  moduleDeps: ModuleDeps;
  filters: Filters;
};

const DepGraph: FC<Props> = ({ moduleDeps, filters }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const graph = useMemo(
    () =>
      createDepGraph({
        moduleDeps,
        ...filters,
      }),
    [moduleDeps, filters],
  );

  useEffect(() => {
    if (containerRef.current) {
      const nodes = graph.modules.map(
        ({ path, isLocal }): Node => ({
          id: path,
          label: isLocal ? filenameFromPath(path) : path,
          title: path,
        }),
      );

      const edges = graph.imports.map(
        ({ fromPath, toPath, isDynamic }): Edge => ({
          from: fromPath,
          to: toPath,
          dashes: isDynamic,
        }),
      );

      const network = new Network(
        containerRef.current,
        { edges, nodes },
        {
          nodes: {
            shape: 'box',
          },
          edges: {
            arrows: 'to',
          },
        },
      );
    }
  }, [containerRef.current, graph]);

  return (
    <div
      ref={containerRef}
      style={{ height: '70vh', width: '100%', border: '1px solid grey' }}
    ></div>
  );
};

export default DepGraph;
