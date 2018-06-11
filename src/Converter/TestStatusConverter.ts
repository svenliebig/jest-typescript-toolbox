import TestStatus from "../Models/TestStatus"
import { TestStatusResponse } from "../Models/ResponseDeclarations"

export default class TestStatusConverter {

	public static responseToModel(response: TestStatusResponse): TestStatus {
		switch (response) {
			case "passed":
				return TestStatus.Passed
			case "failed":
				return TestStatus.Failed
			case "skipped":
				return TestStatus.Skipped
			case "pending":
				return TestStatus.Skipped
			default:
				return TestStatus.NotExecuted
		}
	}
}