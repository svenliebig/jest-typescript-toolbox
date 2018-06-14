import * as ts from "typescript"
import FileNode from "../Models/FileNode"
import BaseNode from "../Models/BaseNode"
import DescribeNode from "../Models/DescribeNode"
import TestNode from "../Models/TestNode"
import ExcludedTestNode from "../Models/ExcludedTestNode"
import FileHelper from "../Utils/FileHelper"

export default class NodeConverter {
	private file: ts.SourceFile
	private testCounter: number = 0
	private describeCounter: number = 0

	constructor(text: string, public path: string, scriptTarget: ts.ScriptTarget = ts.ScriptTarget.Latest) {
		const name = FileHelper.getFileName(path)
		this.file = ts.createSourceFile(name, text, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TSX)
	}

	public createJestNodeTree(): FileNode {
		const root = new FileNode(this.file.fileName, this.path)
		ts.forEachChild(this.file, child => this.parseNode(child, root))
		return root
	}

	public parseNode(node: ts.Node, parent: BaseNode): any {
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

	private parseCallExpression(callExpression: ts.CallExpression): BaseNode | null {
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
				const text = templateExpression.getText()
				if (text) {
					return text
				}
				return this.parseTemplateSpans(templateExpression.templateSpans)
			case ts.SyntaxKind.StringLiteral:
				const stringLiteral: ts.StringLiteral = node as ts.StringLiteral
				return stringLiteral.text
			case ts.SyntaxKind.FirstTemplateToken:
				return (node as any).text
			default:
				return "TEXT NOT FOUND"
		}
	}

	private parseTemplateSpans(nodeArray: ts.NodeArray<ts.Node>): string {
		let text = ""

		nodeArray.forEach(node => {
			switch (node.kind) {
				case ts.SyntaxKind.PropertyAccessExpression:
					const propertyAccessExpression = node as ts.PropertyAccessExpression
					text += this.parsePropertyAccessExpression(propertyAccessExpression.expression)
				case ts.SyntaxKind.TemplateSpan:
					const templateSpan = node as ts.TemplateSpan
					text += this.parseExpression(templateSpan.expression)
			}
		})

		return text
	}

	private parsePropertyAccessExpression(node: ts.LeftHandSideExpression): string {
		console.log("TODO: parse node", node)
		return "propery"
	}

	private parseExpression(exp: ts.Expression) {
		return exp.getText()
	}

	private parseIdentifier(identifier: ts.Identifier, text: string): BaseNode | null {
		const line = this.file.getLineAndCharacterOfPosition(identifier.getStart())

		if (identifier.escapedText === "describe") {
			return new DescribeNode(text, line.line, this.describeCounter++)
		} else if (identifier.escapedText === "it" || identifier.escapedText === "fit") {
			return new TestNode(text, line.line, this.testCounter++)
		} else if (identifier.escapedText === "xit") {
			return new ExcludedTestNode(text, line.line, this.testCounter++)
		}
		return null
	}
}