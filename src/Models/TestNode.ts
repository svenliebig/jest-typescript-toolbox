import AbstractTestNode from "./AbstractTestNode"

export default class TestNode extends AbstractTestNode {
	constructor(name: string, protected line: number, identificator?: number) {
		super(`test: ${name}`, `it-${name}-${identificator || ""}`)
	}

	protected get treeLabel(): string {
		return `${this.line + 1}: ${this.label}`
	}
}