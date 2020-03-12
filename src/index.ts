import express from 'express';
import fs from 'fs-extra';
import { Parser } from 'json2csv';
const xmlParser = require('fast-xml-parser');

import {
  is,
  parseModdle,
} from './helpers';
import { Definitions, Choreography, Gateway, FlowNode } from 'bpmn-moddle';

const xmlOptions = {
  ignoreAttributes : true,
  ignoreNameSpace : true,
  parseNodeValue : true,
  parseAttributeValue : false,
  trimValues: true,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: false
};

const app = express();
app.listen(3000, () => console.log('Example app listening on port 3000!'));

app.get('/', (req, res) => {
  fs.readdir('./models').then(list => {
    // list = list.slice(0, 1000);

    // const promises = list.map(fileName => {
    //   return fs.readFile('./models/' + fileName).then(content => {
    //     return parseModdle(content.toString());
    //   }).then((definitions: any) => {
    //     console.log(definitions.children);
    //     return [fileName, true, definitions];
    //   }).catch(error => {
    //     return [fileName, false, error];
    //   });
    // });

    const promises = list.map(fileName => {
      return fs.readFile('./models/' + fileName).then(content => {
        return xmlParser.getTraversalObj(content.toString(), xmlOptions);
      }).then((definitions: any) => {
        let counter = {};
        let traverse = (obj) => {
          counter[obj.tagname] = 1 + (counter[obj.tagname] || 0);
          for (let type in obj.child) {
            obj.child[type].forEach(traverse);
          }
        };
        traverse(definitions);
        return [fileName, true, counter];
      }).catch(error => {
        return [fileName, false, error];
      });
    });

    return Promise.all(promises);
  }).then(results => {
    const data = results
      // .filter(res => res[1])
      .map(res => { return Object.assign({ filename: res[0], result: res[1] }, res[2]) });

    const json2csvParser = new Parser({ });
    const csv = json2csvParser.parse(data);
    res.attachment('results.csv');
    res.status(200).send(csv);
  });
});

// // route that returns all the gateways from `sample`
// app.get('/gateways', (req, res) => {
//   parseModdle(sample).then((definitions) => {
//     const choreography = <Choreography> definitions.rootElements.find(is('bpmn:Choreography'));
//     if (!choreography) {
//       return res.status(501).send('could not find a choreography instance');
//     }
//     const gateways = <Gateway[]> choreography.flowElements.filter(is('bpmn:Gateway'));
//     res.status(201).send(gateways);
//   });
// });

// // route that returns all the predecessors/successors of flow nodes from `order`
// // example: http://localhost:3000/neighbors/ExclusiveGateway_0f1f4ys
// app.get('/neighbors/:id', (req, res) => {
//   parseModdle(order).then((definitions) => {
//     const choreography = <Choreography> definitions.rootElements.find(is('bpmn:Choreography'));
//     if (!choreography) {
//       return res.status(501).send('could not find a choreography instance');
//     }
//     const id = req.params['id'];
//     const element = <FlowNode> choreography.flowElements.find((element) => element.id == id);
//     if (!element) {
//       return res.status(501).send('could not find element with specified id');
//     }
//     const predecessors = <FlowNode[]> element.incoming.map(flow => flow.sourceRef);
//     const successors = <FlowNode[]> element.outgoing.map(flow => flow.targetRef);
//     res.status(201).send({
//       predecessors: predecessors,
//       successors: successors
//     });
//   });
// });
