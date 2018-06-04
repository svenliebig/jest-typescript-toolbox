import * as vscode from "vscode"

export default class NodeBase {
	protected constructor(protected label: string) {
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.label
		}
	}

	public getChildren(): Array<NodeBase> {
		return []
	}
}