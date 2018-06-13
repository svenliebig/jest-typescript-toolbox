import AbstractTestNode from "./AbstractTestNode"
import Icons from "../Utils/Icons"
import TestStatus from "./TestStatus"

export default class TestNode extends AbstractTestNode {
	private status: TestStatus = TestStatus.NotExecuted

	constructor(name: string, protected line: number, identificator?: number) {
		super(`test: ${name}`, `it-${name}-${identificator || ""}`)
	}

	protected get treeLabel(): string {
		return `${this.line + 1}: ${this.label}`
	}

	protected get icon(): string | undefined {
		switch (this.status) {
			case TestStatus.Failed:
				return Icons.get("times")
			case TestStatus.Passed:
				return Icons.get("check")
			case TestStatus.NotExecuted:
			default:
				return undefined
		}
	}

	public setStatus(arg0: any): any {
		this.status = arg0
	}
}