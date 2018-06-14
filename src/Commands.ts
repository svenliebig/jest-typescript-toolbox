import * as vscode from "vscode"
import TestResultConverter from "./Converter/TestResultConverter"
import { jestExplorer } from "./extension"
import JestRunner from "./JestRunner/JestRunner"
import { TestResultResponse } from "./Models/ResponseDeclarations"
import FileHelper from "./Utils/FileHelper"
import TestFinder from "./Utils/TestFinder"
import Listener from "./Listener"


class RunTestCommand implements vscode.Command {
	public title = "run test"
	public tooltip = ""
	public command = RunTestCommand.command

	public static get command(): string {
		return "jestRunner.runJestTest"
	}

	public static action = () => {
		if (jestExplorer.activeTestsRunning) {
			return
		}

		let fileUrl = jestExplorer.currentTestUrl
		if (fileUrl === null) {
			const editor = vscode.window.activeTextEditor
			if (editor) {
				if (FileHelper.isTypeScriptTestFile(editor.document)) {
					fileUrl = editor.document.fileName
				} else {
					return console.error("Current selected file is no .ts or .tsx test file.")
				}
			} else {
				return console.error("No file url and no open editor.")
			}
		}
		const runner = new JestRunner(fileUrl)
		jestExplorer.setTestsRunning(true)
		runner.run()
			.then((json: TestResultResponse) => {
				const results = TestResultConverter.reponseToModel(json)
				jestExplorer.validateResults(results)
			})
			.catch((e) => {
				vscode.window.showErrorMessage("Testrun Failed: ", e)
			})
			.then(() => jestExplorer.setTestsRunning(false))
	}
}

class ToggleWatch implements vscode.Command {
	public title = "toggle test watch"
	public tooltip = ""
	public command = ToggleWatch.command

	public static get command(): string {
		return "jestRunner.toggleWatch"
	}

	public static action = () => {
		jestExplorer.toggleWatch()
	}
}


/**
 * Contains static methods that are used as commands for this extension
 * in the [extension.ts](./extension.ts).
 *
 * @export
 * @class Commands
 */
export default class Commands {
	public static FindRelatedTest = {
		command: "jestTypescriptToolbox.findRelatedTest",
		action: async () => {
			const editor = vscode.window.activeTextEditor
			if (editor) {
				const finder = new TestFinder(editor.document)
				const testFiles = await finder.findRelatedTest()
				if (testFiles.length === 0) {
					vscode.window.showWarningMessage("No test file found, + create new test for this file + coming soon")
				} else if (testFiles.length === 1) {
					vscode.commands.executeCommand('vscode.open', testFiles[0])
				}
			} else {
				vscode.window.showErrorMessage("Can't find test, no file is currently opened in the Editor.")
			}
		}
	}

	public static ToggleWatch = ToggleWatch
	public static RunTest = RunTestCommand

	public static GoToLine = {
		action: (line: number) => {
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
		}
	}

	public static ReloadTree = {
		command: "jestTypescriptToolbox.reloadTree",
		action: () => {
			const activeTextEditor = vscode.window.activeTextEditor
			Listener.changeActiveTextEditor(activeTextEditor)
		}
	}
}