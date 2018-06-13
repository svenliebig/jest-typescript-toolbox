import * as vscode from "vscode"
import BaseNode from "./BaseNode"
import Icons from "../Utils/Icons"
import GoToLine from "../Commands/GoToLine"
import TestStatus from "./TestStatus"

export default class TestNode extends BaseNode {
	private status: TestStatus = TestStatus.NotExecuted
	private tooltip: string | null = null
	public duration: number | null = null

	constructor(name: string, protected line: number, identificator?: number) {
		super(`test: ${name}`, `it-${name}-${identificator || ""}`)
	}

	public get properties(): vscode.TreeItem {
		return {
			label: `${this.line + 1}: ${this.label}`,
			collapsibleState: vscode.TreeItemCollapsibleState.None,
			iconPath: this.icon,
			command: new GoToLine(this.line),
			tooltip: this.tooltip || undefined
		}
	}

	private get icon(): string | undefined {
		switch (this.status) {
			case TestStatus.Failed:
				return Icons.get("times")
			case TestStatus.Passed:
				return Icons.get("check")
			case TestStatus.NotExecuted:
			default:
				return undefined
		}
	}

	public setStatus(arg0: any): any {
		this.status = arg0
	}

	public setTooltip(str: string | null): void {
		this.tooltip = str || null
	}

	public setDuration(duration: number): void {
		this.duration = duration
	}
}