import { ICruiseResult } from 'dependency-cruiser';
import React, { FC, useEffect, useState } from 'react';
import { parseModules } from '../utils/parsers';

const JSON_URL =
  process.env.NODE_ENV === 'production'
    ? '../cli/reporter-output.json'
    : '../../../dist/cli/reporter-output.json';

const App: FC = () => {
  const [data, setData] = useState<ICruiseResult>();
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

  const modules = parseModules(data);
  return (
    <div>
      <h1>Modules</h1>
      <ul>
        {modules?.map(({ path, isLocal, alias }) => (
          <li key={path}>
            {!isLocal ? (
              <em>{path}</em>
            ) : alias ? (
              `${path} (aka ${alias})`
            ) : (
              path
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
