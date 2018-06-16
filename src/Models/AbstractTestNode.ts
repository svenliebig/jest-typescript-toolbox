import * as vscode from "vscode"
import GoToLine from "../Commands/GoToLine"
import BaseNode from "./BaseNode"
import TestStatus from "./TestStatus"
import Icons from "../Utils/Icons"

export default abstract class AbstractTestNode extends BaseNode {
	private status: TestStatus = TestStatus.NotExecuted
	protected tooltip: string | null = null
	protected abstract line: number

	constructor(name: string, id: string) {
		super(name, id)
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.treeLabel,
			collapsibleState: vscode.TreeItemCollapsibleState.None,
			iconPath: this.icon,
			command: new GoToLine(this.line),
			tooltip: this.tooltip || undefined
		}
	}

	protected get icon(): string | undefined {
		switch (this.status) {
			case TestStatus.Failed:
				return Icons.get("times")
			case TestStatus.Passed:
				return Icons.get("check")
			case TestStatus.Skipped:
				return Icons.get("times-grey")
			case TestStatus.NotExecuted:
			default:
				return undefined
		}
	}

	protected abstract get treeLabel(): string

	public setStatus(status: TestStatus): void {
		this.status = status
	}

	public setTooltip(str: string | null): void {
		this.tooltip = str || null
	}
}