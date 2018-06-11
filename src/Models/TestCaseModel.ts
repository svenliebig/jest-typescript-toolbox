import TestStatus from "./TestStatus"
import AssertionResultModel from "./AssertionResultModel"

export default class TestCaseModel {
	constructor(
		public readonly duration: number,
		public readonly status: TestStatus,
		public readonly assertions: Array<AssertionResultModel>
	) { }

	public get line(): number {
		return this.assertions.reduce<AssertionResultModel>((prev, next) => prev.line ? prev : next, new AssertionResultModel(null, "", TestStatus.Skipped)).line || 0
	}
	public get message(): string | null {
		return this.assertions.reduce<AssertionResultModel>((prev, next) =>
			prev.message ? prev : next, new AssertionResultModel(null, "", TestStatus.Skipped)).message || null
	}
}