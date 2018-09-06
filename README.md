# exercism-javascript
Javascript track projects for [exercism.io](https://exercism.io/tracks/javascript)

## Overview
Exercises organized in a Monorepo format based on [Yarn Workspaces](https://yarnpkg.com/) and [Lerna](https://lernajs.io).  Prequisites are a working node/npm installation.

Excercism projects are basically problems with test suites attached.  

## Setup
This repository is organized to support the [Exercism CLI](https://exercism.io/cli-walkthrough).

to set up the workspace, from the project directory enter the following command:
```sh
exercism --workspace=$(pwd)
```

When exercises are fetched they will be created in the `javascript` folder.

To test projects you need`yarn`

`npm install -g yarn`

Then you can install dependencies

`yarn`

## Testing
`yarn test`
