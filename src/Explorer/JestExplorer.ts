import * as vscode from "vscode"
import * as path from "path"
import Icons from "../Icons/Icons"
import NodeBase from "./Nodes/NodeBase"
import DescribeNode from "./Nodes/DescribeNode"
import TestNode from "./Nodes/TestNode"
import RunJestTest from "../JestRunner/Commands/RunJestTest"

export class JestTestFile extends NodeBase {
	public readonly collapsibleState: vscode.TreeItemCollapsibleState
	private children: Array<NodeBase> = []

	constructor(file: vscode.TextDocument) {
		super(file.fileName.split(path.sep).pop()!)
		this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded
		this.createChildren(file)
	}

	public getChildren() {
		return this.children
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.label,
			collapsibleState: this.collapsibleState,
			iconPath: Icons.get("glass")
		}
	}

	private createChildren(file: vscode.TextDocument) {
		const content = file.getText()
		const describeAndItRegex = /^[\s]*(describe|it)/i
		const results = content.split(/\n/).map((value, line) => {
			if (value) {
				const result = describeAndItRegex.exec(value)
				if (result) {
					if (result[1] === "describe") {
						return new DescribeNode(result.input, line)
					}

					if (result[1] === "it") {
						return new TestNode(result.input, line)
					}
				}
				return null
			}
		})
		this.children = results.filter(e => e) as Array<NodeBase>
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
		const jestFile = new JestTestFile(file)
		const jestRunner = new JestRunNode(file.fileName)
		this.tree.push(jestRunner)
		this.tree.push(jestFile)
		this.refresh()
	}

	public refresh() {
		this._onDidChangeTreeData.fire(undefined)
	}

	public clearTree() {
		this.tree = []
	}
}