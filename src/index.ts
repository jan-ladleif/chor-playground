import BpmnModdle from 'bpmn-moddle';
import express from 'express';
import * as fs from 'fs';

const moddle = new BpmnModdle();

export let parseModdle = (xml: string): Promise<object> => {
  return new Promise<object>((resolve, reject) => {
    moddle.fromXML(xml, (err: any, definitions: object) => {
      if (!err) {
        resolve(definitions);
      } else {
        reject(err);
      }
    });
  });
};

const sample = JSON.parse(fs.readFileSync('../assets/V7.bpmn', 'utf-8'));

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!!!!!!!xasasxx');
});

app.get('/test', (req, res) => {
  parseModdle(sample).then((result) => {
    res.status(201).send(result);
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
