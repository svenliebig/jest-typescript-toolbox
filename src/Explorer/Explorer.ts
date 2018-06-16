import * as vscode from "vscode"
import NodeConverter from "../Converter/NodeConverter"
import BaseNode from "../Models/BaseNode"
import FileNode from "../Models/FileNode"
import RunTestNode from "../Models/RunTestNode"
import WatchNode from "../Models/WatchNode"
import TestResultModel from "../Models/TestResultModel"
import AbstractTestNode from "../Models/AbstractTestNode"

export default class JestExplorer implements vscode.TreeDataProvider<BaseNode> {
	private tree: Array<BaseNode> = []

	private runnerNode: RunTestNode = new RunTestNode()
	private watchNode: WatchNode = new WatchNode()
	private testTree: FileNode | null = null

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
		this.runnerNode.testRunning = value
		/** @todo after the test run, i can't just refresh the runnerNode, investigate */
		this.refresh()
	}

	public get activeTestsRunning(): boolean {
		return this.runnerNode.testRunning
	}

	public toggleWatch(): any {
		this.watchNode.enabled = !this.watchNode.enabled
		this.refresh(this.watchNode)
	}

	public get watchMode(): boolean {
		return this.watchNode.enabled
	}

	public createTree(fileText: string, filePath: string) {
		const converter = new NodeConverter(fileText, filePath)
		const tree = converter.createJestNodeTree()

		if (this.testTree) {
			if (tree.integrityChain === this.testTree.integrityChain) {
				return
			} else {
				console.log(`integrityChain did not work`)
				console.log(this.testTree.integrityChain)
				console.log(tree.integrityChain)
			}
		}

		this.testTree = tree
		this.clearTree()
		this.buildTree()
		this.refresh()
	}

	private buildTree() {
		if (this.tree.length === 0) {
			this.tree.push(this.runnerNode)
			this.tree.push(this.watchNode)

			if (this.testTree) {
				this.tree.push(this.testTree)
			}
		}
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

	public get currentTestUrl(): string | null {
		if (this.testTree) {
			return this.testTree.path
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
				const testNode = this.findChildrenWithLine(this.testTree!, assertion.line) as AbstractTestNode
				if (testNode) {
					testNode.setStatus(assertion.status)
					testNode.setTooltip(assertion.message)
					this.refresh(testNode)
				}
			})
		})
	}

	/**
	 * Refreshes the hole Tree.
	 *
	 * @memberof JestExplorer
	 */
	public refresh(node?: BaseNode) {
		this._onDidChangeTreeData.fire(node)
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