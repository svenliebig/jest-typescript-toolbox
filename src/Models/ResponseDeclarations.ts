/**
 * The Status response
 * 
 * @todo lookup the other possible status
 */
export type TestStatusResponse = "failed" | "passed" | "skipped"

export type TestCaseResponse = {
	/**
	 * The Assertion Results of this test case.
	 *
	 * @type {Array<AssertionResultResponse>}
	 */
	assertionResults: Array<AssertionResultResponse>

	/**
	 * Unix Timestamp
	 *
	 * @type {number}
	 */
	endTime: number

	/**
	 *Complete test message.
	 *
	 * @type {string}
	 */
	message: string

	/**
	 * The absolute Path of the file, win example:
	 * 
	 * "e:\workspace\time\web\test\Components\Oldyojio.test.tsx"
	 *
	 * @type {string}
	 */
	name: string
	/**
	 * Unix Timestamp
	 *
	 * @type {number}
	 */
	startTime: number

	status: TestStatusResponse
	summary: string
}

export type AssertionResultResponse = {
	/**
	 *
	 *
	 * @type {Array}
	 */
	ancestorTitles: Array<string>

	/**
	 * Array with the failed assertions messages.
	 *
	 * @type {Array<string>}
	 */
	failureMessages: Array<string>
	/**
	 * Name of the test (argument of the it function and the parent describe blocks)
	 *
	 * @type {string}
	 */
	fullName: string
	location: AssertionLocationResponse,
	status: TestStatusResponse

	/**
	 * Name of the test (only argument of the it, look this.fullName)
	 *
	 * @type {string}
	 */
	title: string
}

export type AssertionLocationResponse = {
	column: number, line: number
}

export type TestResultResponse = {
	numFailedTestSuites: number
	numFailedTests: number
	numPassedTestSuites: number
	numPassedTests: number
	numPendingTestSuites: number
	numPendingTests: number
	numRuntimeErrorTestSuites: number
	numTotalTestSuites: number
	numTotalTests: number
	openHandles: Array<any>
	snapshot: {
		added: number
		didUpdate: false
		failure: false
		filesAdded: number
		filesRemoved: number
		filesUnmatched: number
		filesUpdated: number
		matched: number
		total: number
		unchecked: number
		uncheckedKeysByFile: Array<any>
		unmatched: number
		updated: number
	},
	startTime: number
	success: boolean
	testResults: Array<TestCaseResponse>
	wasInterrupted: boolean
}
