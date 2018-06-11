/**
 * The Status response
 * 
 * @todo lookup the other possible status
 */
export type TestStatusResponse = "failed" | "passed" | "skipped" | "pending"

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
	coverageMap?: {
		[file: string]: {
			path: string,
			statementMap: {
				[key: string]: {
					start: {
						line: number,
						column: number
					},
					end: {
						line: number,
						column: number
					}
				},
			},
			// TODO
			fnMap: {},
			// TODO
			branchMap: {},
			// TODO
			s: {},
			// TODO
			f: {},
			// TODO
			b: {},
			_coverageSchema: string,
			hash: string
		}
	}
}

// EXAMPLE;

// "fnMap": {
// 	"0": {
// 		"name": "(anonymous_5)",
// 		"decl": {
// 			"start": {
// 				"line": 10,
// 				"column": 0
// 			},
// 			"end": {
// 				"line": null,
// 				"column": -1
// 			}
// 		},
// 		"loc": {
// 			"start": {
// 				"line": 10,
// 				"column": 0
// 			},
// 			"end": {
// 				"line": 10,
// 				"column": -1
// 			}
// 		}
// 	},
// 	"1": {
// 		"name": "Oldyolo",
// 		"decl": {
// 			"start": {
// 				"line": 12,
// 				"column": 4
// 			},
// 			"end": {
// 				"line": 12,
// 				"column": 15
// 			}
// 		},
// 		"loc": {
// 			"start": {
// 				"line": 12,
// 				"column": 28
// 			},
// 			"end": {
// 				"line": 17,
// 				"column": 5
// 			}
// 		}
// 	},
// 	"2": {
// 		"name": "(anonymous_7)",
// 		"decl": {
// 			"start": {
// 				"line": 19,
// 				"column": 4
// 			},
// 			"end": {
// 				"line": null,
// 				"column": -1
// 			}
// 		},
// 		"loc": {
// 			"start": {
// 				"line": 19,
// 				"column": 4
// 			},
// 			"end": {
// 				"line": 23,
// 				"column": 5
// 			}
// 		}
// 	}
// },
// "branchMap": {
// 	"0": {
// 		"loc": {
// 			"start": {
// 				"line": 13,
// 				"column": 8
// 			},
// 			"end": {
// 				"line": 13,
// 				"column": 20
// 			}
// 		},
// 		"type": "binary-expr",
// 		"locations": [{
// 			"start": {
// 				"line": 13,
// 				"column": 8
// 			},
// 			"end": {
// 				"line": 13,
// 				"column": 20
// 			}
// 		}, {
// 			"start": {
// 				"line": 13,
// 				"column": 20
// 			},
// 			"end": {
// 				"line": 17,
// 				"column": 4
// 			}
// 		}]
// 	}
// },
// "s": {
// 	"0": 1,
// 	"1": 1,
// 	"2": 1,
// 	"3": 0,
// 	"4": 0,
// 	"5": 1,
// 	"6": 0,
// 	"7": 1
// },
// "f": {
// 	"0": 1,
// 	"1": 0,
// 	"2": 0
// },
// "b": {
// 	"0": [0, 0]
// }
