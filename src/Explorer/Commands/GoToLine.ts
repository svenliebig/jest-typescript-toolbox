import * as vscode from "vscode"

export default class GoToLine implements vscode.Command {
	title = ""
	tooltip = ""
	arguments: Array<any> = []
	command = "jestExplorer.goToLine"

	constructor(line: number) {
		this.arguments = [line]
	}
}
