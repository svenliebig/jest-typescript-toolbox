import * as path from "path"
import * as vscode from "vscode"
import NodeConverter from "../Converter/NodeConverter"
import BaseNode from "../Models/BaseNode"
import RunTestNode from "../Models/RunTestNode"
import TestResultModel from "../Models/TestResultModel"
import TestNode from "../Models/TestNode"

export default class JestExplorer implements vscode.TreeDataProvider<BaseNode> {
	private tree: Array<BaseNode> = []

	private _onDidChangeTreeData: vscode.EventEmitter<BaseNode> = new vscode.EventEmitter<BaseNode>()
	readonly onDidChangeTreeData: vscode.Event<BaseNode> = this._onDidChangeTreeData.event

	public getTreeItem(e: BaseNode): vscode.TreeItem {
		return { ...e.properties }
	}

	public getChildren(e: BaseNode | undefined): Promise<BaseNode[]> {
		if (!e) {
			return Promise.resolve(this.tree)
		}
		return Promise.resolve(e.getChildren())
	}

	public setTestsRunning(value: boolean) {
		const runnter = this.tree.filter(e => e.id === "jest-test-runner-node")[0] as RunTestNode
		runnter.testRunning = value
		this.refresh()
	}

	public createTree(fileText: string, fileName: string) {
		const converter = new NodeConverter(fileText, fileName.split(path.sep).pop()!)
		const tree = converter.createJestNodeTree()

		if (this.tree.length === 2) {
			if (tree.integrityChain === this.tree[1].integrityChain) {
				return
			} else {
				console.log(`integrityChain did not work`)
				console.log(this.tree[1].integrityChain)
				console.log(tree.integrityChain)
			}
		}

		const jestRunner = new RunTestNode(fileName)
		this.clearTree()
		this.tree.push(jestRunner)
		this.tree.push(tree)
		this.refresh()
	}

	private findChildrenWithLine(node: BaseNode, line: number | null): BaseNode | null {
		if (node.hasLine(line)) {
			return node
		}

		if (node.hasChildren()) {
			const children = node.getChildren()
			let child: BaseNode | null = null
			children.forEach((it) => {
				if (!child) {
					child = this.findChildrenWithLine(it, line)
				}
			})
			return child
		}

		return null
	}

	public validateResults(result: TestResultModel): any {
		result.suites.forEach(testSuite => {
			const runTestNode = this.tree[0] as RunTestNode

			if (runTestNode) {
				runTestNode.setDuration(testSuite.duration)
			}

			testSuite.assertions.forEach(assertion => {
				const testNode = this.findChildrenWithLine(this.tree[1], assertion.line) as TestNode
				if (testNode) {
					testNode.setStatus(assertion.status)
					testNode.setTooltip(assertion.message)
				}
			})
		})
	}

	/**
	 * Refreshes the hole Tree.
	 *
	 * @memberof JestExplorer
	 */
	public refresh() {
		this._onDidChangeTreeData.fire(undefined)
	}

	/**
	 * Clears the tree.
	 *
	 * @memberof JestExplorer
	 */
	public clearTree() {
		this.tree = []
	}
}