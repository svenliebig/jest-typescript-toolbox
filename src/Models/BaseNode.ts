import * as vscode from "vscode"

export default class BaseNode {
	private children: Array<BaseNode> = []
	protected line?: number

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

	public get integrityChain(): string {
		return `${this.id}-${this.hasChildren() ? this.getChildren().map(e => e.integrityChain).join("_") : ""}`
	}

	public hasLine(line: number | null) {
		return this.line === line
	}
}