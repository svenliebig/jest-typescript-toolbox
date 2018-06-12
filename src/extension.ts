import * as vscode from "vscode"
import Commands from "./Commands"
import { Commands as CommandsEnum } from "./Commands/index"
import JestExplorer from "./Explorer/JestExplorer"
import Listener from "./Listener"

export let jestExplorer: JestExplorer

export function activate(context: vscode.ExtensionContext) {
    // Create the explorer View
    jestExplorer = new JestExplorer()

    // Disposable, things that will be removed when this extension is disabled
    context.subscriptions.push(vscode.Disposable.from(
        // Views
        vscode.window.registerTreeDataProvider('jestExplorer', jestExplorer),

        // Listener
        vscode.window.onDidChangeActiveTextEditor(Listener.changeActiveTextEditor),
        vscode.workspace.onDidSaveTextDocument(Listener.saveTextDocument),

        // Commands
        vscode.commands.registerCommand(CommandsEnum.RunJestTest, Commands.runJestTest),
        vscode.commands.registerCommand(CommandsEnum.GoToLine, Commands.GoToLine.action),
        vscode.commands.registerCommand(Commands.ReloadTree.command, Commands.ReloadTree.action),
        vscode.commands.registerCommand(Commands.FindRelatedTest.command, Commands.FindRelatedTest.action),
    ))

    // Load initial tree
    Commands.ReloadTree.action()
}

export function deactivate() {
    // nothing to deactivate, everything related is in the context.subscriptions
}