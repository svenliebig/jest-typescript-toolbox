import * as vscode from "vscode"
import { Commands } from "./index"

export default class GoToLine implements vscode.Command {
	title = ""
	tooltip = ""
	arguments: Array<any> = []
	command = Commands.GoToLine

	constructor(line: number) {
		this.arguments = [line]
	}
}
