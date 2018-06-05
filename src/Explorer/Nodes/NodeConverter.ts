import * as ts from "typescript"
import { JestTestFile } from "../JestExplorer"
import NodeBase from "./NodeBase"
import DescribeNode from "./DescribeNode"
import TestNode from "./TestNode"

let counter: number = 0
export default class NodeConverter {
	public static textToTypescriptSourceFile(text: string, name: string = "f", scriptTarget: ts.ScriptTarget = ts.ScriptTarget.Latest): ts.SourceFile {
		const file: ts.SourceFile = ts.createSourceFile(name, text, ts.ScriptTarget.Latest)
		return file
	}

	public static typescriptSouceFileToJestNodeTree(file: ts.SourceFile): NodeBase {
		const root = new JestTestFile(file.fileName)
		ts.forEachChild(file, child => NodeConverter.parseNode(child, root))
		return root
	}

	public static parseNode(node: ts.Node, parent: NodeBase): any {
		switch (node.kind) {
			case ts.SyntaxKind.ExpressionStatement:
				console.log("ExpressionStatement")
				const expressionStatement: ts.ExpressionStatement = node as ts.ExpressionStatement
				NodeConverter.parseNode(expressionStatement.expression, parent)
				break
			case ts.SyntaxKind.CallExpression:
				console.log("CallExpression")
				const callExpression: ts.CallExpression = node as ts.CallExpression
				const treeNode = NodeConverter.parseCallExpression(callExpression)
				if (treeNode) {
					parent.appendChild(treeNode)
					callExpression.forEachChild(child => NodeConverter.parseNode(child, treeNode))
				}
				return NodeConverter.parseNode(callExpression.expression, parent)
			case ts.SyntaxKind.Identifier:
				console.log("Identifier")
				const identifier: ts.Identifier = node as ts.Identifier
				console.log(identifier)
				break
			case ts.SyntaxKind.ArrowFunction:
				console.log("ArrowFunction")
				const arrowFunction: ts.ArrowFunction = node as ts.ArrowFunction
				console.log(arrowFunction)
				arrowFunction.forEachChild(child => NodeConverter.parseNode(child, parent))
				break
			case ts.SyntaxKind.Block:
				console.log("Block")
				const block: ts.Block = node as ts.Block
				console.log(block)
				block.forEachChild(child => NodeConverter.parseNode(child, parent))
				break
		}
	}

	private static parseCallExpression(callExpression: ts.CallExpression): NodeBase | null {
		const expression = callExpression.expression
		const args = callExpression.arguments

		let text = ""

		args.forEach(arg => {
			const temp = NodeConverter.parseCallExpressionArguments(arg)
			if (temp !== "TEXT NOT FOUND") {
				text = temp
			}
		})

		if (expression.kind === ts.SyntaxKind.Identifier) {
			return NodeConverter.parseIdentifier(expression as ts.Identifier, text)
		}


		return null
	}

	private static parseCallExpressionArguments(node: ts.Node): string {
		switch (node.kind) {
			case ts.SyntaxKind.TemplateExpression:
				const templateExpression: ts.TemplateExpression = node as ts.TemplateExpression
				return NodeConverter.parseTemplateSpan(templateExpression.templateSpans[0])
			case ts.SyntaxKind.StringLiteral:
				const stringLiteral: ts.StringLiteral = node as ts.StringLiteral
				console.log("StringLiteral", stringLiteral.text)
				return stringLiteral.text
			default:
				return "TEXT NOT FOUND"
		}
	}

	private static parseTemplateSpan(node: ts.TemplateSpan): string {
		return NodeConverter.parsePropertyAccessExpression(node.expression as any)
	}

	private static parsePropertyAccessExpression(node: ts.PropertyAccessExpression): string {
		return "property access"
	}

	private static parseIdentifier(identifier: ts.Identifier, text: string): NodeBase | null {
		if (identifier.escapedText === "describe") {
			return new DescribeNode(text, counter++)
		}
		if (identifier.escapedText === "it") {
			return new TestNode(text, counter++)
		}
		return null
	}
}