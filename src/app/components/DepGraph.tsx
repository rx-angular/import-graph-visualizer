import React, { FC, useEffect, useRef } from 'react';
import { Edge, Network, Node } from 'vis-network/standalone';

type Props = {};

const DepGraph: FC<Props> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const nodes: Node[] = [
        { id: 1, label: 'Node 1' },
        { id: 2, label: 'Node 2' },
        { id: 3, label: 'Node 3' },
        { id: 4, label: 'Node 4' },
        { id: 5, label: 'Node 5' },
      ];

      const edges: Edge[] = [
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 3 },
      ];

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
  }, [containerRef.current]);

  return (
    <div
      ref={containerRef}
      style={{ height: '50vh', width: '100%', border: '1px solid grey' }}
    ></div>
  );
};

export default DepGraph;
