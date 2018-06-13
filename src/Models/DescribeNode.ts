import * as vscode from "vscode"
import BaseNode from "./BaseNode"
import GoToLine from "../Commands/GoToLine"

export default class DescribeNode extends BaseNode {
	constructor(name: string, protected line: number, identifier?: number) {
		super(`describe: ${name}`, `d-${name}-${identifier || ""}`)
	}

	public get properties(): vscode.TreeItem {
		return {
			label: `${this.line + 1}: ${this.label}`,
			collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
			command: new GoToLine(this.line),
			contextValue: "jestExplorerDescribeNode",
		}
	}
}