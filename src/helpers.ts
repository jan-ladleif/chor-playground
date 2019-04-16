import BpmnModdle, { Definitions } from 'bpmn-moddle';
const moddle = new BpmnModdle();

export function parseModdle(xml: string): Promise<Definitions> {
  return new Promise<Definitions>((resolve, reject) => {
    moddle.fromXML(xml, (err: any, definitions: Definitions) => {
      if (!err) {
        resolve(definitions);
      } else {
        reject(err);
      }
    });
  });
}

export function is(...types: string[]) {
  return (element: any) => {
    return types.some((type) => element.$instanceOf(type));
  };
}
