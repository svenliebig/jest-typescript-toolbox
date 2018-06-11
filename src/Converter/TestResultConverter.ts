import TestResultModel from "../Models/TestResultModel"
import { TestResultResponse } from "../Models/ResponseDeclarations"
import TestCaseConverter from "./TestCaseConverter"
import TestCaseModel from "../Models/TestCaseModel"

/**
 * 
 *
 * @export
 * @class TestResultConverter
 */
export default class TestResultConverter {

	/**
	 *
	 *
	 * @static
	 * @param {TestResultResponse} response
	 * @returns {TestResultModel}
	 * @memberof TestResultConverter
	 */
	public static reponseToModel(response: TestResultResponse): TestResultModel {
		const passed = response.numPassedTests
		const failed = response.numFailedTests
		const total = response.numTotalTests
		const duration = new Date().getTime() - response.startTime

		let results: Array<TestCaseModel> = []
		if (Array.isArray(response.testResults)) {
			results = response.testResults.map(TestCaseConverter.responseToModel)
		}

		return new TestResultModel(passed, failed, total, duration, results)
	}
}