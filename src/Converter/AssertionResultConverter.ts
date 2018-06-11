import AssertionResultModel from "../Models/AssertionResultModel"
import { AssertionResultResponse } from "../Models/ResponseDeclarations"
import TestStatusConverter from "./TestStatusConverter"

export default class AssertionResultConverter {

	public static responseToModel(response: AssertionResultResponse): AssertionResultModel {
		let line = null
		if (response.location) {
			line = response.location.line - 1
		}

		const messages = response.failureMessages.join("\n")

		const status = TestStatusConverter.responseToModel(response.status)

		return new AssertionResultModel(line, messages, status)
	}
}