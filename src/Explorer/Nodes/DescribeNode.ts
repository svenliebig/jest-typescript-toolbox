import * as vscode from "vscode"
import NodeBase from "./NodeBase"
import Icons from "../../Icons/Icons"
import GoToLine from "../Commands/GoToLine"

export default class DescribeNode extends NodeBase {
	constructor(name: string, private line: number) {
		super(`describe: ${name}`)
	}

	public get properties(): vscode.TreeItem {
		return {
			label: `${this.line + 1}: ${this.label}`,
			collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
			iconPath: Icons.get("pencil"),
			command: new GoToLine(this.line),
			contextValue: "jestExplorerDescribeNode",
		}
	}
}