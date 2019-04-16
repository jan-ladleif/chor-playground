import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

import {
  is,
  parseModdle,
} from './helpers';

const sample = fs.readFileSync(path.join(__dirname, '/../assets/sample.bpmn'), 'utf-8');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!!!!!!!xasasxx');
});

app.get('/test', (req, res) => {
  parseModdle(sample).then((result) => {
    res.status(201).send(result.rootElements.filter(is('bpmn:Choreography')));
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
