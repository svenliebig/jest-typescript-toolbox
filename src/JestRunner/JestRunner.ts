import * as child_process from "child_process"
import * as path from "path"
import PathHelper from "../Utils/PathHelper"
import { TestResultResponse } from "../Models/ResponseDeclarations"

export class JestProcess {
	public jsonOutput: boolean = false
	public showConfig: boolean = false

	private projectRootPath: string
	private packageJsonPath: string
	private relativeTestFilePath: string

	private pathHelper = new PathHelper()

	constructor(private fileToTest: string) {
		const packageJson = this.pathHelper.getLastPackageJsonForFile(this.fileToTest)!
		this.projectRootPath = packageJson.split("package.json")[0]
		this.packageJsonPath = packageJson
		this.relativeTestFilePath = this.pathHelper.getRelativeFilePathToWorkspaceRoot(this.fileToTest, this.projectRootPath)
	}

	startWithSpawn(): Promise<any> {
		return new Promise((resolve, reject) => {
			const env = process.env
			env["CI"] = true
			const cpr = child_process.spawn("node", this.commandArguments, { env })

			let stdOut = ""

			cpr.stdout.on('data', (data: Buffer) => {
				const stringValue = data.toString().trim();
				stdOut += stringValue
			})

			cpr.stderr.on('data', (data: Buffer) => {
				const stringValue = data.toString().trim();
				console.log(`DATA: ${stringValue}`)
			})

			cpr.on('error', (error: Error) => {
				const stringValue = error.toString().trim();
				console.log(`ERR: ${stringValue}`)
			})

			cpr.on('exit', () => {
				resolve(stdOut)
			})
		})
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
		return path.normalize(path.join(__dirname, "..", "..", "node_modules", "jest", "bin", "jest"))
	}
}

export default class JestRunner {
	constructor(private fileUrl: string) {
	}

	/**
	 * 
	 *
	 * @returns {Promise<TestResultResponse>}
	 * @memberof JestRunner
	 */
	public run(): Promise<TestResultResponse> {
		return new Promise<TestResultResponse>((resolve, reject) => {
			const jestProcess = new JestProcess(this.fileUrl)
			jestProcess.jsonOutput = true
			jestProcess.startWithSpawn()
				.then((json) => {
					console.log("plain json", json)
					const result = JSON.parse(json) as TestResultResponse
					console.log("parsed json", result)
					resolve(result)
				})
				.catch(e => {
					reject(e as any)
				})
		})
	}
}