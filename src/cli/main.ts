#!/usr/bin/env node

import { createReporterOutput } from './reporter';
import { runStaticServer } from './server';

createReporterOutput();

runStaticServer();
