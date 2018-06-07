'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import JestExplorer from './Explorer/JestExplorer'
import JestRunner from './JestRunner/JestRunner'
import { TestResultResponse } from './Converter/TestResultConverter'
// import JestExplorerProvider from "./Explorer/JestExplorer"

export var jestExplorer: JestExplorer

export function activate(context: vscode.ExtensionContext) {
    jestExplorer = new JestExplorer()
    vscode.window.registerTreeDataProvider('jestExplorer', jestExplorer)

    vscode.commands.registerCommand("jestRunner.runJestTest", (fileUrl: string) => {
        const runner = new JestRunner(fileUrl)
        jestExplorer.setTestsRunning(true)
        runner.createTestRun()
            .then((json: TestResultResponse) => {
                jestExplorer.validateResults(json.testResults)
                vscode.window.showInformationMessage(`Test Run Complete`, `Failed: ${json.numFailedTests}`, `Passed: ${json.numPassedTests}`)
            })
            .catch((e) => {
                vscode.window.showErrorMessage("Testrun Failed: ", e)
            })
            .then(() => jestExplorer.setTestsRunning(false))
    })

    vscode.commands.registerCommand("jestExplorer.goToLine", (line: number) => {
        const editor = vscode.window.activeTextEditor
        if (editor) {
            const posStart = new vscode.Position(line, 0)
            const posEnd = new vscode.Position(line, 9999)
            const select = new vscode.Selection(posStart, posEnd)
            editor.selection = select

            let offset = 0
            if (editor.visibleRanges.length === 1) {
                const { start, end } = editor.visibleRanges[0]
                offset = parseInt(((end.line - start.line) / 2).toFixed(0))
            }
            const viewStartPosition = new vscode.Position(line - offset > 0 ? line - offset : 0, 0)
            const viewEndPosition = new vscode.Position(line + offset, 0)
            const range = new vscode.Range(viewStartPosition, viewEndPosition)
            editor.revealRange(range)
        }
    })

    const isTypeScriptTestFile = (doc: vscode.TextDocument): boolean => {
        const { languageId, fileName } = doc
        if (languageId === "typescriptreact" || languageId === "typescript") {
            const regex = new RegExp("(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$")
            const result = regex.exec(fileName)
            if (result) {
                return true
            }
        }
        return false
    }

    const activeEditorListener = (e: vscode.TextEditor | undefined) => {
        if (e) {
            if (isTypeScriptTestFile(e.document)) {
                jestExplorer.createTree(e.document)
            } else {
                jestExplorer.clearTree()
                jestExplorer.refresh()
            }
        }
    }

    const refreshEditor = () => {
        const activeTextEditor = vscode.window.activeTextEditor
        activeEditorListener(activeTextEditor)
    }

    vscode.window.onDidChangeActiveTextEditor(activeEditorListener)

    let disposable = vscode.commands.registerCommand("jestTypescriptToolbox.reloadTree", () => {
        refreshEditor()
    })

    context.subscriptions.push(disposable)
    refreshEditor()
}

export function deactivate() {
}