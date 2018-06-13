import * as vscode from "vscode"
import GoToLine from "../Commands/GoToLine"
import BaseNode from "./BaseNode"

export default abstract class AbstractTestNode extends BaseNode {
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

	protected abstract get treeLabel(): string
	protected abstract get icon(): string | undefined

	public setTooltip(str: string | null): void {
		this.tooltip = str || null
	}
}