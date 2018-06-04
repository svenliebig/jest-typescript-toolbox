import * as vscode from "vscode"
import NodeBase from "./NodeBase"
import Icons from "../../Icons/Icons"
import GoToLine from "../Commands/GoToLine"

export default class DescribeNode extends NodeBase {
	constructor(name: string, private line: number) {
		super(`describe: ${name.trim().slice(10, name.trim().length - 10)}`)
	}

	public get properties(): vscode.TreeItem {
		return {
			label: `${this.line}: ${this.label}`,
			collapsibleState: vscode.TreeItemCollapsibleState.None,
			iconPath: Icons.get("pencil"),
			command: new GoToLine(this.line)
		}
	}
}