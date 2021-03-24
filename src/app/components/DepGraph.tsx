import { Snackbar, SnackbarContent } from '@material-ui/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Edge, Network, Node } from 'vis-network/standalone';
import { filenameFromPath } from '../utils/format';
import { createDepGraph } from '../utils/graph';
import { DepGraph, Filters, ModuleDeps } from '../utils/types';

type Props = {
  moduleDeps: ModuleDeps;
  filters: Filters;
};

type Stage = 'idle' | 'computing' | 'drawing';

const DepGraph: FC<Props> = ({ moduleDeps, filters }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [graph, setGraph] = useState<DepGraph>();

  const [stage, setStage] = useState<Stage>('idle');

  useEffect(() => {
    setStage('computing');
    setTimeout(() => {
      const newGraph = createDepGraph({ moduleDeps, ...filters });
      setGraph(newGraph);
      setStage('drawing');
    }, 100);
  }, [moduleDeps, filters]);

  useEffect(() => {
    if (containerRef.current && graph != null) {
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

      network.on('afterDrawing', () => {
        setStage('idle');
      });
    }
  }, [containerRef.current, graph]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          height: 'calc(100vh - 310px)',
          width: '100%',
          border: '1px dotted grey',
          borderRadius: 4,
          marginTop: 15,
        }}
      ></div>
      <Snackbar open={stage === 'computing'}>
        <SnackbarContent message="Calculating all import paths between target and source modules..." />
      </Snackbar>
      <Snackbar open={stage === 'drawing'}>
        <SnackbarContent message="Drawing import graph to canvas..." />
      </Snackbar>
    </>
  );
};

export default DepGraph;
