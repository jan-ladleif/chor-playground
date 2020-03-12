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

    // element type counter
    // const promises = list.map(fileName => {
    //   let fileContent;
    //   return fs.readFile('./models/' + fileName).then(content => {
    //     fileContent = content.toString();
    //     return parseModdle(fileContent);
    //   }).then((definitions: any) => {
    //     return xmlParser.getTraversalObj(fileContent, xmlOptions);
    //   }).then((traversal: any) => {
    //     let counter = {};
    //     let traverse = (obj) => {
    //       counter[obj.tagname] = 1 + (counter[obj.tagname] || 0);
    //       for (let type in obj.child) {
    //         obj.child[type].forEach(traverse);
    //       }
    //     };
    //     traverse(traversal);
    //     return { _fileName: fileName, _valid: true, ...counter };
    //   }).catch(error => {
    //     return { _fileName: fileName, _valid: false, _importError: error };
    //   });
    // });

    // timer event definitions
    const promises = list.map(fileName => {
      let fileContent;
      return fs.readFile('./models/' + fileName).then(content => {
        fileContent = content.toString();
        return xmlParser.getTraversalObj(fileContent, xmlOptions);
      }).then((traversal: any) => {
        let expressions = [];
        let traverse = (obj) => {
          const tagname = obj.tagname;

          if (tagname == 'timeDuration' || tagname == 'timeCycle' || tagname == 'timeDate') {
            expressions.push(obj.val);
          }

          for (let type in obj.child) {
            obj.child[type].forEach(traverse);
          }
        };
        traverse(traversal);

        if (expressions.length > 0) {
          return { _fileName: fileName, _valid: true, ...expressions };
        } else {
          return false;
        }
      }).catch(error => {
        // do not log errors
        return false;
      });
    });

    return Promise.all(promises);
  }).then(results => {
    results = results.filter(res => res);
    const json2csvParser = new Parser({ });
    const csv = json2csvParser.parse(results);
    res.attachment('results.csv');
    res.status(200).send(csv);
  });
});
