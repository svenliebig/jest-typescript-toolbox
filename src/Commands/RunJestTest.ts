import * as vscode from "vscode"
import { Commands } from "./index"

export default class RunJestTest implements vscode.Command {
	title = ""
	tooltip = ""
	arguments: Array<any> = []
	command = Commands.RunJestTest

	constructor(fileUrl: string) {
		this.arguments = [fileUrl]
	}

}
