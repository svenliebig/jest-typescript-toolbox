import TestStatus from "./TestStatus"

export default class AssertionResultModel {
	constructor(
		public readonly line: number | null,
		public readonly message: string,
		public readonly status: TestStatus
	) { }
}