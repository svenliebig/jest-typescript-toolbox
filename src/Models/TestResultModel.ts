import TestCaseModel from "./TestCaseModel"

export default class TestResultModel {
	constructor(
		public readonly passed: number,
		public readonly failed: number,
		public readonly total: number,
		public readonly duration: number,
		public readonly suites: Array<TestCaseModel>
	) { }
}