import * as vscode from "vscode"

export default class RunJestTest implements vscode.Command {
	title = ""
	tooltip = ""
	arguments: Array<any> = []
	command = "jestRunner.runJestTest"

	constructor(fileUrl: string) {
		this.arguments = [fileUrl]
	}
}
