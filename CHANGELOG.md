# Change Log

All notable changes to the "jest-typescript-toolbox" extension will be documented in this file.

## [1.3.0 - 14-06-2018] ([PR](https://github.com/Sly321/jest-typescript-toolbox/pull/6))

- Watch Mode is now available and can be toggled from the tree view - if enabled, the test will run when the implementation file or the test file is saved
- Improvements to the tree rendering performance, rather render single nodes if possible

## [1.2.2 - 14-06-2018] ([PR](https://github.com/Sly321/jest-typescript-toolbox/pull/5))

- Separate the `xit` and the `it` test. The `xit` tests have a slighly grey `x` on the treeview as icon

## [1.2.1 - 13-06-2018] ([PR](https://github.com/Sly321/jest-typescript-toolbox/pull/4))

- Improved tree rerendering:
  - rerender the tree when:
    - active edtior file is changed to a different test or not related file
    - a `describe` name has changed
    - a `it` name has changed
    - `it` / `describe` was added
    - `it` / `describe` was removed
    - `it` / `describe` position changed it's position before or after another `it` / `describe`
  - do not rerender when:
    - only blank line was added or some functions that are not `describe` or `it`
    - change file to the implementation class of the test

## [1.2.0 - 12-06-2018] ([PR](https://github.com/Sly321/jest-typescript-toolbox/pull/3))

- Added Command: Find Related Test, you can open the related test from the implementation file. The name pattern is `myfile.ts` or `myfile.tsx` will find the test in the workspace `myfile.test.ts` or `myfile.test.tsx`
- Added Feature: The Tree view for the test will load, if you have opened the implementation file and the name pattern is equal to the previously explained `Find Related Test` command
- Added Feature: You can run the test if you have opened you test file, and use the `keyboard shortcut` that you have added to the `jestRunner.runJestTest` command, you need to add it own you own by `ctrl+shift+p` > `open keyboard shortcuts` and searche for `jestRunner.runJestTest`

## [1.1.1 - 11-06-2018]

- Fix, for some reason the tough-cookie dependencies did not success in a full install, so psl dependency was missing

## [1.1.0 - 11-06-2018] ([PR](https://github.com/Sly321/jest-typescript-toolbox/pull/2))

- Reload the NodeTree on save

## [1.0.0 - 11-06-2018]

- Outline in *.test.tsx files for `describe` and `xit,fit,it` functions
- Run tests with the Jest Explorer and show results
- Failed tests messages as tooltips to the failed test nodes
