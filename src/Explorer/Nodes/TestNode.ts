import * as vscode from "vscode"
import NodeBase from "./NodeBase"
import Icons from "../../Icons/Icons"
import GoToLine from "../Commands/GoToLine"

export default class TestNode extends NodeBase {
	constructor(name: string, private line: number) {
		super(`test: ${name.trim().slice(4, name.trim().length - 10)}`)
	}

	public get properties(): vscode.TreeItem {
		return {
			label: `${this.line}: ${this.label}`,
			collapsibleState: vscode.TreeItemCollapsibleState.None,
			iconPath: Icons.get("cogs"),
			command: new GoToLine(this.line)
		}
	}
}