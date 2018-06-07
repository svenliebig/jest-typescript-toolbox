import * as vscode from "vscode"

export default class NodeBase {
	private children: Array<NodeBase> = []

	protected constructor(protected label: string, public id: string = "") {
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.label
		}
	}

	public getChildren(): Array<NodeBase> {
		return this.children
	}

	public appendChild(node: NodeBase): void {
		this.children.push(node)
	}

	public hasChildren(): boolean {
		return this.children.length > 0
	}
}