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
		this.clearTree()
		const jestRunner = new RunTestNode(fileName)
		this.tree.push(jestRunner)
		const converter = new NodeConverter(fileText, fileName.split(path.sep).pop()!)
		this.tree.push(converter.createJestNodeTree())
		this.refresh()
	}

	public refresh() {
		this._onDidChangeTreeData.fire(undefined)
	}

	public clearTree() {
		this.tree = []
	}

	private findChildrenWithId(node: BaseNode, id: string): BaseNode | null {
		if (node.id === id) {
			return node
		}

		if (node.hasChildren()) {
			const children = node.getChildren()
			let child: BaseNode | null = null
			children.forEach((it) => {
				if (!child) {
					child = this.findChildrenWithId(it, id)
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
				const testNode = this.findChildrenWithId(this.tree[1], `test-node-${assertion.line}`) as TestNode
				if (testNode) {
					testNode.setStatus(assertion.status)
					testNode.setTooltip(assertion.message)
				}
			})

			// if (result.assertionResults !== null) {
			// 	result.assertionResults.forEach(assertion => {
			// 		if (assertion.location !== null) {
			// 			const testNode = this.findChildrenWithId(this.tree[1], `test-node-${assertion.location.line - 1}`) as TestNode

			// 			if (testNode) {
			// 				switch (assertion.status) {
			// 					case "failed":
			// 						testNode.setStatus(TestStatus.Failed)
			// 						break;
			// 					case "passed":
			// 						testNode.setStatus(TestStatus.Passed)
			// 						break;
			// 					default:
			// 						testNode.setStatus(TestStatus.NotExecuted)
			// 						break;
			// 				}
			// 			}
			// 		}
			// 	})
			// }
		})
	}
}