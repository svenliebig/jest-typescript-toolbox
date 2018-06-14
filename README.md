# jest-typescript-toolbox 1.3.0

The target of this extension is to display an outline for jest testfile in typescript context. Future goals are automatic jest runs, result views in the outline and jump to location.

-----------------------------------------------------------------------------------------------------------

![preview](https://raw.githubusercontent.com/Sly321/jest-typescript-toolbox/master/assets/preview.gif)

-----------------------------------------------------------------------------------------------------------

## Features

### Tree View

Shows a collapsable Tree View of `describes` and `it` blocks as Outline, while in *.test.tsx files.

#### Tree View - Support

> tested with the [example app](https://github.com/Sly321/jest-typescript-toolbox-example-app)

- [x] Windows, projects build with WLS
- [ ] Windows, projects build with Powershell (not tested)
- [x] MacOS
- [ ] Linux (not tested)

### Run Tests

Possibility to run the Tests in the current file and get instand feedback about them.

#### Run Tests - Support

- [x] Windows, projects build with WLS
- [ ] Windows, projects build with Powershell (not tested)
- [x] MacOS
- [ ] Linux (not tested)

### Failed Test Result as Tooltip

The failed tests get their assertion result as tooltips now.

## Requirements

Your project need a properly formed `tsconfig` file and `package.json`, tested this setup with `ts-jest` and a project that is equal to `typescript-create-react-app`. You can find an example application that is running with this extension [here](https://github.com/Sly321/jest-typescript-toolbox-example-app).

## Future

- [x] test --watch mode
- [ ] when no test file was found, ask to create a new test
- [ ] open test on node click, when current active file is implementation file
- [ ] cascading test result, highlight the describe node if a nested test fails (option)
- [ ] stop describe nodes from collapsing onclick
- [ ] test file templates (?) maybe from snippet template
- [ ] snapshot, possibility to update on failing snapshots (maybe with context menu)
- [ ] Open related test in a new window to the left | right | top | bottom
- [ ] Find related implementation
- [ ] show coverage

## Extension Settings

.gitkeep

## Known Issues

- Multiple assertions in 1 tests may only show the last failed assertion

## [Change Log](https://github.com/Sly321/jest-typescript-toolbox/blob/master/CHANGELOG.md)
