import TestCaseModel from "../Models/TestCaseModel"
import { TestCaseResponse } from "../Models/ResponseDeclarations"
import AssertionResultModel from "../Models/AssertionResultModel"
import TestStatus from "../Models/TestStatus"
import TestStatusConverter from "./TestStatusConverter"
import AssertionResultConverter from "./AssertionResultConverter"

export default class TestCaseConverter {
	public static responseToModel(response: TestCaseResponse): TestCaseModel {
		const duration = response.endTime - response.startTime
		const status: TestStatus = TestStatusConverter.responseToModel(response.status)
		const assertions: Array<AssertionResultModel> = response.assertionResults.map(AssertionResultConverter.responseToModel)
		return new TestCaseModel(duration, status, assertions)
	}
}