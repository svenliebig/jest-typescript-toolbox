import * as vscode from "vscode"

export default class BaseNode {
	private children: Array<BaseNode> = []

	protected constructor(protected label: string, public id: string = "") {
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.label
		}
	}

	public getChildren(): Array<BaseNode> {
		return this.children
	}

	public appendChild(node: BaseNode): void {
		this.children.push(node)
	}

	public hasChildren(): boolean {
		return this.children.length > 0
	}
}