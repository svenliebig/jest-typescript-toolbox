# jest-typescript-toolbox README

The target of this extension is to display an outline for jest testfile in typescript context. Future goals are automatic jest runs, result views in the outline and jump to location.

-----------------------------------------------------------------------------------------------------------

## WORK IN PROGRESS

-----------------------------------------------------------------------------------------------------------

## Features

### Tree View

Shows a collapsable Tree View of `describes` and `it` blocks as Outline, while in *.test.tsx files.

#### Tree View - Support

- [x] Windows, projects build with WLS
- [ ] Windows, projects build with Powershell (not tested)
- [ ] MacOS (not tested)
- [ ] Linux (not tested)

### Run Tests

Possibility to run the Tests in the current file and get instand feedback about them.

#### Run Tests - Support

- [x] Windows, projects build with WLS
- [ ] Windows, projects build with Powershell (not tested)
- [ ] MacOS (not tested)
- [ ] Linux (not tested)

## Requirements

Your project need a properly formed `tsconfig` file and `package.json`, tested this setup with `ts-jest` and a project that is equal to `typescript-create-react-app`.

## Future

- better icons for passed and failed tests
- test --watch mode
- tooltip on tree node for test-results
- stop describe nodes from collapsing onclick

## Extension Settings

.gitkeep

## Known Issues

.gitkeep