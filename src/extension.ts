'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import JestExplorer from './Explorer/JestExplorer'
import JestRunner from './JestRunner/JestRunner'
// import JestExplorerProvider from "./Explorer/JestExplorer"

export var jestExplorer: JestExplorer

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        vscode.window.showInformationMessage('Hello World!');
    })

    jestExplorer = new JestExplorer()
    vscode.window.registerTreeDataProvider('jestExplorer', jestExplorer)

    // vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
    //     console.log(`onDidChangeTextDocument`, e)
    // })

    // vscode.workspace.onDidCloseTextDocument((e: vscode.TextDocument) => {
    //     console.log("onDidCloseTextDocument", e)
    // })

    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor | undefined) => {
        // console.log("onDidChangeActiveTextEditor")
        if (e) {
            if (e.document.languageId === "typescriptreact") {
                jestExplorer.createTree(e.document)
            }
        }
    })

    vscode.commands.registerCommand("jestRunner.runJestTest", (fileUrl: string) => {
        const runner = new JestRunner(fileUrl)
        runner.createTestRun()
    })

    vscode.commands.registerCommand("jestExplorer.goToLine", (line: number) => {
        const editor = vscode.window.activeTextEditor
        if (editor) {
            const posStart = new vscode.Position(line, 0)
            const posEnd = new vscode.Position(line, 9999)
            const select = new vscode.Selection(posStart, posEnd)
            editor.selection = select

            // range offset und so

            const range = new vscode.Range(posStart, posEnd)
            editor.revealRange(range)
        }
    })

    context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {
}