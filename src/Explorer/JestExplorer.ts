import * as vscode from "vscode"
import * as path from "path"
import Icons from "../Icons/Icons"
import NodeBase from "./Nodes/NodeBase"
import NodeConverter from "./Nodes/NodeConverter"
import RunJestTest from "../JestRunner/Commands/RunJestTest"

export class JestTestFile extends NodeBase {
	public readonly collapsibleState: vscode.TreeItemCollapsibleState

	constructor(label: string) {
		super(label)
		this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.label,
			collapsibleState: this.collapsibleState,
			iconPath: Icons.get("glass")
		}
	}
}

export class JestRunNode extends NodeBase {
	constructor(private fileUrl: string) {
		super("Diese Tests ausführen")
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.label,
			iconPath: Icons.get("play"),
			command: new RunJestTest(this.fileUrl)
		}
	}
}

export default class JestExplorer implements vscode.TreeDataProvider<NodeBase> {
	private tree: Array<NodeBase> = []

	private _onDidChangeTreeData: vscode.EventEmitter<NodeBase> = new vscode.EventEmitter<NodeBase>();
	readonly onDidChangeTreeData: vscode.Event<NodeBase> = this._onDidChangeTreeData.event;

	constructor() {
	}

	public getTreeItem(e: NodeBase): vscode.TreeItem {
		return {
			...e.properties,
		}
	}

	public getChildren(e: NodeBase | undefined): Promise<NodeBase[]> {
		if (!e) {
			return Promise.resolve(this.tree)
		}
		return Promise.resolve(e.getChildren())
	}

	public createTree(file: vscode.TextDocument) {
		this.clearTree()
		const jestRunner = new JestRunNode(file.fileName)
		this.tree.push(jestRunner)
		const converter = new NodeConverter(file.getText(), file.fileName.split(path.sep).pop()!)
		this.tree.push(converter.createJestNodeTree())
		this.refresh()
	}

	public refresh() {
		this._onDidChangeTreeData.fire(undefined)
	}

	public clearTree() {
		this.tree = []
	}
}