import * as ts from "typescript"
import { JestTestFile } from "../JestExplorer"
import NodeBase from "./NodeBase"
import DescribeNode from "./DescribeNode"
import TestNode from "./TestNode"

export default class NodeConverter {
	private file: ts.SourceFile

	constructor(text: string, name: string = "f", scriptTarget: ts.ScriptTarget = ts.ScriptTarget.Latest) {
		this.file = ts.createSourceFile(name, text, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TSX)
	}

	public createJestNodeTree(): NodeBase {
		const root = new JestTestFile(this.file.fileName)
		ts.forEachChild(this.file, child => this.parseNode(child, root))
		return root
	}

	public parseNode(node: ts.Node, parent: NodeBase): any {
		switch (node.kind) {
			case ts.SyntaxKind.ExpressionStatement:
				const expressionStatement: ts.ExpressionStatement = node as ts.ExpressionStatement
				this.parseNode(expressionStatement.expression, parent)
				break
			case ts.SyntaxKind.CallExpression:
				const callExpression: ts.CallExpression = node as ts.CallExpression
				const treeNode = this.parseCallExpression(callExpression)
				if (treeNode) {
					parent.appendChild(treeNode)
					callExpression.forEachChild(child => this.parseNode(child, treeNode))
				}
				return this.parseNode(callExpression.expression, parent)
			// case ts.SyntaxKind.Identifier:
			// 	const identifier: ts.Identifier = node as ts.Identifier
			// 	break
			case ts.SyntaxKind.ArrowFunction:
				const arrowFunction: ts.ArrowFunction = node as ts.ArrowFunction
				arrowFunction.forEachChild(child => this.parseNode(child, parent))
				break
			case ts.SyntaxKind.Block:
				const block: ts.Block = node as ts.Block
				block.forEachChild(child => this.parseNode(child, parent))
				break
		}
	}

	private parseCallExpression(callExpression: ts.CallExpression): NodeBase | null {
		const expression = callExpression.expression
		const args = callExpression.arguments

		let text = ""

		args.forEach(arg => {
			const temp = this.parseCallExpressionArguments(arg)
			if (temp !== "TEXT NOT FOUND") {
				text = temp
			}
		})

		if (expression.kind === ts.SyntaxKind.Identifier) {
			return this.parseIdentifier(expression as ts.Identifier, text)
		}


		return null
	}

	private parseCallExpressionArguments(node: ts.Node): string {
		switch (node.kind) {
			case ts.SyntaxKind.TemplateExpression:
				const templateExpression: ts.TemplateExpression = node as ts.TemplateExpression
				return this.parseTemplateSpans(templateExpression.templateSpans)
			case ts.SyntaxKind.StringLiteral:
				const stringLiteral: ts.StringLiteral = node as ts.StringLiteral
				return stringLiteral.text
			default:
				return "TEXT NOT FOUND"
		}
	}

	private parseTemplateSpans(node: ts.NodeArray<ts.Node>): string {
		let text = ""
		node.forEach(node => {
			switch (node.kind) {
				case ts.SyntaxKind.PropertyAccessExpression:
					const propertyAccessExpression = node as ts.PropertyAccessExpression
					return this.parsePropertyAccessExpression(propertyAccessExpression.expression)
			}
		})

		return text
	}

	private parsePropertyAccessExpression(node: ts.LeftHandSideExpression): string {
		console.log("TODO: parse node", node)
		return "propery"
	}

	private parseIdentifier(identifier: ts.Identifier, text: string): NodeBase | null {
		const line = this.file.getLineAndCharacterOfPosition(identifier.getStart())

		if (identifier.escapedText === "describe") {
			return new DescribeNode(text, line.line)
		}
		if (identifier.escapedText === "it") {
			return new TestNode(text, line.line)
		}
		return null
	}
}