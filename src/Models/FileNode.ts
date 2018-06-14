import BaseNode from "./BaseNode"
import * as vscode from "vscode"

/**
 * Represents a [TreeItem](#vscode.TreeItem), [BaseNode](#BaseNode)
 *
 * @export
 * @class FileNode
 * @extends {BaseNode}
 */
export default class FileNode extends BaseNode {
	public readonly collapsibleState: vscode.TreeItemCollapsibleState

	constructor(label: string, public path: string) {
		super(label, label)
		this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.label,
			collapsibleState: this.collapsibleState,
		}
	}
}