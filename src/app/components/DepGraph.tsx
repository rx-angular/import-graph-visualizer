import React, { FC, useEffect, useMemo, useRef } from 'react';
import { Edge, Network, Node } from 'vis-network/standalone';
import { createDepGraph } from '../utils/deps';
import { DepGraph, ModuleDeps } from '../utils/types';

type Props = {
  moduleDeps: ModuleDeps;
  rootModules: string[];
  leafModules: string[];
};

const DepGraph: FC<Props> = ({ moduleDeps, rootModules, leafModules }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const graph = useMemo(
    () => createDepGraph({ moduleDeps, rootModules, leafModules }),
    [moduleDeps, rootModules, leafModules],
  );

  useEffect(() => {
    if (containerRef.current) {
      const nodes = graph.modules.map(
        ({ path }): Node => ({ id: path, label: path }),
      );

      const edges = graph.imports.map(
        ({ fromPath, toPath }): Edge => ({ from: fromPath, to: toPath }),
      );

      const network = new Network(
        containerRef.current,
        { edges, nodes },
        {
          edges: {
            arrows: 'to',
          },
          layout: {
            hierarchical: {
              sortMethod: 'directed',
            },
          },
        },
      );
    }
  }, [containerRef.current, graph]);

  return (
    <div
      ref={containerRef}
      style={{ height: '50vh', width: '100%', border: '1px solid grey' }}
    ></div>
  );
};

export default DepGraph;
