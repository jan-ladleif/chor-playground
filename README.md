# chor-playground

This repository provides the following setup:

- Node.js express server
- TypeScript integration
- Linting using TSLint
- `bpmn-moddle` integration

## Installation

```
npm install
```

## Scripts

- `npm run build` - builds the project, i.e., compiles the TypeScript code to JavaScript
- `npm run serve` - serves the previously built project
- `npm run watch` - build the projects, serves it and automatically updates on local changes
- `npm run lint` - runs the linter

## Docker

```
docker build -t chor-playground .
docker run --rm -p 3000:3000 --name chor-playground -it chor-playground
```