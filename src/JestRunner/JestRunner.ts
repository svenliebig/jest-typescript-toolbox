import PathHelper from "../Utils/PathHelper"
import * as path from "path"
const jest = require("jest")
// import { Runner, ProjectWorkspace } from "jest-editor-support"

import * as child_process from "child_process"
import { TestResultResponse } from "../Converter/TestResultConverter"

export class JestProcess {
	public jsonOutput: boolean = false
	public showConfig: boolean = false

	private projectRootPath: string
	private packageJsonPath: string
	private relativeTestFilePath: string

	constructor(private fileToTest: string) {
		const packageJson = PathHelper.getLastPackageJsonForFile(this.fileToTest)!
		this.projectRootPath = packageJson.split("package.json")[0]
		this.packageJsonPath = packageJson
		this.relativeTestFilePath = PathHelper.getRelativeFilePathToWorkspaceRoot(this.fileToTest, this.projectRootPath)
	}

	/**
	 * For Debug usage only, you can't debug that easily through child processes.
	 *
	 * @memberof JestProcess
	 */
	startWithJs() {
		jest.run(this.commandArguments)
	}

	start(): Promise<any> {
		return new Promise((resolve, reject) => {
			// const env = process.env
			// env["CI"] = true
			// const cpr = child_process.spawn("node", this.commandArguments, { env })

			// cpr.stdout.on('data', (data: Buffer) => {
			// 	const stringValue = data.toString().trim();
			// 	console.log(stringValue)
			// })

			// cpr.stderr.on('data', (data: Buffer) => {
			// 	const stringValue = data.toString().trim();
			// 	console.log(stringValue)
			// })

			// cpr.on('error', (error: Error) => {
			// 	const stringValue = error.toString().trim();
			// 	console.log(stringValue)
			// })

			// cpr.on('exit', (e) => {
			// 	console.log(e)
			// });

			child_process.exec(`${this.executableCommand}`, ((error, stdout, stderr) => {
				if (error) {
					resolve(stdout)
				}

				resolve(stdout)
			}))
		})
	}

	private get executableCommand(): string {
		let commands = ["node"].concat(this.commandArguments)
		return commands.join(" ")
	}

	private get commandArguments(): Array<string> {
		let commands = [this.jestPath, `-c=${this.packageJson}`, this.relativeFilePath]

		if (this.jsonOutput) {
			commands.push("--json")
		}
		if (this.showConfig) {
			commands.push("--showConfig")
		}

		commands.push("--testLocationInResults")

		return commands
	}

	private get relativeFilePath(): string {
		return this.relativeTestFilePath
	}

	private get packageJson(): string {
		return this.packageJsonPath
	}

	/**
	 * Only for windows by now, under a project that was build with the wsl
	 *
	 * @readonly
	 * @private
	 * @type {string}
	 * @memberof JestProcess
	 */
	private get jestPath(): string {
		return path.normalize(path.join(__dirname, "..", "..", "node_modules", "jest", "bin", "jest")).replace(/\\/g, "\\\\")
	}
}

export default class JestRunner {
	constructor(private fileUrl: string) {
	}

	public async createTestRun(): Promise<TestResultResponse> {
		return new Promise<TestResultResponse>((resolve, reject) => {
			const jprocess = new JestProcess(this.fileUrl)
			jprocess.jsonOutput = true
			jprocess.start()
				.then((json) => {
					const result = JSON.parse(json) as TestResultResponse
					resolve(result)
				})
				.catch(e => {
					reject(e as any)
				})
		})
	}
}