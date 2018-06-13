import AbstractTestNode from "./AbstractTestNode"
import Icons from "../Utils/Icons"

export default class ExcludedTestNode extends AbstractTestNode {
	constructor(name: string, protected line: number, identificator?: number) {
		super(`xtest: ${name}`, `xit-${name}-${identificator || ""}`)
	}

	protected get icon(): string | undefined {
		return Icons.get("times-grey")
	}

	protected get treeLabel(): string {
		return `${this.line + 1}: ${this.label}`
	}
}