import * as fs from "fs"
import * as vscode from "vscode"
import { jestExplorer } from "./extension"
import FileHelper from "./Utils/FileHelper"
import TestFinder from "./Utils/TestFinder"
import Commands from "./Commands"

/**
 * Contains static methods that are used as listeners for this extension
 * in the [extension.ts](./extension.ts).
 *
 * @export
 * @class Listener
 */
export default class Listener {

	public static saveTextDocument(e: vscode.TextDocument) {
		if (FileHelper.isTypeScriptTestFile(e)) {
			jestExplorer.createTree(e.getText(), e.fileName)
			if (jestExplorer.watchMode) {
				Commands.RunTest.action()
			}
		}
	}

	/**
	 * 
	 *
	 * @static
	 * @param {(vscode.TextEditor | undefined)} e
	 * @returns
	 * @memberof Listener
	 * 
	 * @todo If the newTree === oldTree, don't create
	 */
	public static async changeActiveTextEditor(e: vscode.TextEditor | undefined) {
		if (e) {
			if (FileHelper.isTypeScriptTestFile(e.document)) {
				return jestExplorer.createTree(e.document.getText(), e.document.fileName)
			} else if (FileHelper.isTypeScriptFile(e.document)) {
				const finder = new TestFinder(e.document)
				const related = await finder.findRelatedTest()
				if (related.length === 1) {
					const file = related.pop()!
					const content = fs.readFileSync(file.fsPath, "UTF-8")
					return jestExplorer.createTree(content, file.fsPath)
				}
			}
		}
		jestExplorer.clearTree()
		jestExplorer.refresh()
	}
}