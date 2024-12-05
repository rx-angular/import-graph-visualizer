import { Button, Snackbar, SnackbarContent } from '@material-ui/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Edge, Network, Node } from 'vis-network/standalone';
import { getIconUrlByName, getIconUrlForFilePath } from 'vscode-material-icons';
import Worker from 'worker-loader!../workers/graph.worker';
import { filenameFromPath } from '../utils/format';
import { ICONS_URL } from '../utils/icons';
import { DepGraph, Filters, ModuleDeps } from '../utils/types';

type Props = {
  moduleDeps: ModuleDeps;
  filters: Filters;
  physicsSimulation: boolean;
};

type Stage = 'idle' | 'computing' | 'drawing';

const DepGraph: FC<Props> = ({ moduleDeps, filters, physicsSimulation }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [graph, setGraph] = useState<DepGraph>();

  const [worker, setWorker] = useState<Worker>();

  const [stage, setStage] = useState<Stage>('idle');
  const [network, setNetwork] = useState<Network>();

  useEffect(() => {
    setStage('computing');
    if (worker != null) {
      worker.terminate();
    }
    const newWorker = new Worker();
    newWorker.postMessage({ moduleDeps, ...filters });
    newWorker.onmessage = ({ data }: MessageEvent<DepGraph>) => {
      setGraph(data);
      setStage('drawing');
      newWorker.terminate();
    };
    setWorker(newWorker);
  }, [moduleDeps, filters]);

  useEffect(() => {
    if (containerRef.current && graph != null) {
      const nodes = graph.modules.map(
        ({ path, isLocal }): Node => ({
          id: path,
          label: isLocal ? filenameFromPath(path) : path,
          title: path,
          image: isLocal
            ? getIconUrlForFilePath(path, ICONS_URL)
            : getIconUrlByName('npm', ICONS_URL),
        }),
      );

      const edges = graph.imports.map(
        ({ fromPath, toPath, isDynamic }): Edge => ({
          from: fromPath,
          to: toPath,
          dashes: isDynamic,
        }),
      );

      const newNetwork = new Network(
        containerRef.current,
        { edges, nodes },
        {
          physics: { enabled: physicsSimulation },
          nodes: {
            shape: 'image',
            shapeProperties: {
              useBorderWithImage: true,
            },
            image: getIconUrlByName('file', ICONS_URL),
            color: {
              border: '#888',
              background: '#fff',
              highlight: {
                border: '#888',
                background: '#eee',
              },
            },
          },
          edges: {
            arrows: 'to',
            color: '#888',
          },
        },
      );

      newNetwork.on('afterDrawing', () => {
        setStage('idle');
      });

      setNetwork(newNetwork);
    }
  }, [containerRef.current, graph]);

  useEffect(() => {
    if (physicsSimulation) {
      network?.startSimulation();
    } else {
      network?.stopSimulation();
    }
    network?.setOptions({ physics: { enabled: physicsSimulation } });
  }, [physicsSimulation, network]);

  const handleTerminate = () => {
    if (worker != null) {
      worker.terminate();
      setWorker(undefined);
      setStage('idle');
    }
  };

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
        <SnackbarContent
          message="Calculating all import paths between target and source modules..."
          action={
            <Button color="secondary" onClick={handleTerminate}>
              Terminate
            </Button>
          }
        />
      </Snackbar>
      <Snackbar open={stage === 'drawing'}>
        <SnackbarContent message="Drawing import graph to canvas..." />
      </Snackbar>
    </>
  );
};

export default DepGraph;
