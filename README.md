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
- [ ] Windows, projects build with Powershell
- [ ] MacOS
- [ ] Linux

### Run Tests

Possibility to run the Tests in the current file and get instand feedback about them.

#### Run Tests - Support

- [x] Windows, projects build with WLS
- [ ] Windows, projects build with Powershell
- [ ] MacOS
- [ ] Linux

## Requirements

Your project need a properly formed `tsconfig` file and `package.json`, tested this setup with `ts-jest` and a project that is equal to `typescript-create-react-app`.

## Extension Settings

.gitkeep

## Known Issues

.gitkeep