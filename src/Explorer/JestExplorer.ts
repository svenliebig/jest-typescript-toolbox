import * as vscode from "vscode"
import * as path from "path"
import Icons from "../Icons/Icons"
import NodeBase from "./Nodes/NodeBase"
import NodeConverter from "./Nodes/NodeConverter"
import RunJestTest from "../JestRunner/Commands/RunJestTest"
import { TestCaseResponse } from "../Converter/TestResultConverter"
import TestNode, { TestStatus } from "./Nodes/TestNode"

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
	public testRunning: boolean

	constructor(private fileUrl: string) {
		super("Diese Tests ausführen", "jest-test-runner-node")
		this.testRunning = false
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.label,
			iconPath: this.testRunning ? Icons.getGif("pending") : Icons.get("play"),
			command: this.testRunning ? undefined : new RunJestTest(this.fileUrl)
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

	public setTestsRunning(value: boolean) {
		const runnter = this.tree.filter(e => e.id === "jest-test-runner-node")[0] as JestRunNode
		runnter.testRunning = value
		this.refresh()
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

	private findChildrenWithId(node: NodeBase, id: string): NodeBase | null {
		if (node.id === id) {
			return node
		}

		if (node.hasChildren()) {
			const children = node.getChildren()
			let child: NodeBase | null = null
			children.forEach((it) => {
				if (!child) {
					child = this.findChildrenWithId(it, id)
				}
			})
			return child
		}

		return null
	}

	public validateResults(results: Array<TestCaseResponse>): any {
		results.forEach(result => {
			if (result.assertionResults !== null) {
				result.assertionResults.forEach(assertion => {
					if (assertion.location !== null) {
						const testNode = this.findChildrenWithId(this.tree[1], `test-node-${assertion.location.line - 1}`) as TestNode

						if (testNode) {
							switch (assertion.status) {
								case "failed":
									testNode.setStatus(TestStatus.Failed)
									break;
								case "passed":
									testNode.setStatus(TestStatus.Passed)
									break;
								default:
									testNode.setStatus(TestStatus.NotExecuted)
									break;
							}

						}
					}
				})
			}
		})
	}
}