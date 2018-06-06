import PathHelper from "../Utils/PathHelper"
import * as path from "path"
const jest = require("jest")
// import { Runner, ProjectWorkspace } from "jest-editor-support"

import * as child_process from "child_process"

export class JestProcess {
	public jsonOutput: boolean = false
	public showConfig: boolean = false

	constructor(private fileToTest: string) {
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

		return commands
	}

	private get relativeFilePath(): string {
		return "./test/Components/Oldyojio.test.tsx"
	}

	private get packageJson(): string {
		return PathHelper.getLastPackageJsonForFile(this.fileToTest)!
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

	public async createTestRun() {
		const jprocess = new JestProcess(this.fileUrl)
		jprocess.jsonOutput = true
		jprocess.start()
			.then((json) => {
				console.log(json)
				const result = JSON.parse(json)
				console.log(result)
			})
			.catch(e => {
				console.log(e)
			})
	}
}