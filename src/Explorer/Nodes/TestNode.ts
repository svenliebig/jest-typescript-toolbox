import * as vscode from "vscode"
import NodeBase from "./NodeBase"
import Icons from "../../Icons/Icons"
import GoToLine from "../Commands/GoToLine"

export enum TestStatus {
	NotExecuted,
	Failed,
	Passed
}

export default class TestNode extends NodeBase {
	private status: TestStatus = TestStatus.NotExecuted

	constructor(name: string, private line: number) {
		super(`test: ${name}`, `test-node-${line}`)
	}

	public get properties(): vscode.TreeItem {
		return {
			label: `${this.line + 1}: ${this.label}`,
			collapsibleState: vscode.TreeItemCollapsibleState.None,
			iconPath: this.icon,
			command: new GoToLine(this.line)
		}
	}

	private get icon(): string {
		switch (this.status) {
			case TestStatus.NotExecuted:
				return Icons.get("cogs")
			case TestStatus.Failed:
				return Icons.get("times")
			case TestStatus.Passed:
				return Icons.get("check")
		}
	}

	public setStatus(arg0: any): any {
		this.status = arg0
	}
}