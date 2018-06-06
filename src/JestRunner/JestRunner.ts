import PathHelper from "../Utils/PathHelper"
import * as path from "path"
// const jest = require("jest")
import { Runner, ProjectWorkspace } from "jest-editor-support"

export default class JestRunner {
	constructor(private fileUrl: string) {
	}

	public async createTestRun() {
		// process.on('unhandledRejection', (err: any) => {
		// 	throw err;
		// }); process.env.BABEL_ENV = 'test';
		// process.env.NODE_ENV = 'test';
		// process.env.PUBLIC_URL = '';
		// process.stderr.on("data", (data: any) => {
		// 	console.log("stderr", data)
		// })
		// process.stdout.on("data", (data: any) => {
		// 	console.log("stdout", data)
		// })
		// await jest.run([this.configArgs, this.fileUrl])

		const rootPath = path.normalize(path.join("e:", "workspace", "time", "web"))
		const pathToJest = path.normalize(path.join(__dirname, "..", "..", "node_modules", ".bin", "jest"))
		const pathToConfig = PathHelper.getLastPackageJsonForFile(this.fileUrl)!
		const ws = new ProjectWorkspace(rootPath, "jest", pathToConfig, 23)

		const runner = new Runner(ws, {
			testFileNamePattern: "./test/Components/Oldyojio.test.tsx"
		})

		let exited = false
		let keepAliveCounter = 5

		runner.on('executableJSON', (data: any) => {
			console.log("executableJSON", data)
		})
		runner.on('executableOutput', (output: string) => {
			console.log("executableOutput", output)
		})
		runner.on('executableStdErr', (error: Buffer) => console.log("executableStdErr", error))
		runner.on('nonTerminalError', (error: string) => {
			console.log("nonTerminalError", error)
		})
		runner.on('exception', (result: any) => {
			console.log("exception", result)
		})
		runner.on('terminalError', (error: string) => {
			console.log("terminalError", error, error.toString())
		})
		runner.on('debuggerProcessExit', (e: any) => {
			console.log(`asdf`, e)
			if (!exited) {
				console.log(`doasdf2ne`, e)
				console.log(`doasdf2ne`, runner)
				exited = true
				if (--keepAliveCounter > 0) {
					runner.removeAllListeners()
					// this.startRunner()
				} else {
					console.log(`done`)
				}
			}
		})



		try {
			runner.start()
		} catch (e) {
			console.log(e)
		}
		// await jest.run([this.configArgs, "./test/Components/Oldyojio.test.tsx", "--json"])
		// 	.then((e: any) => {
		// 		console.log("Then")
		// 		console.log(e)
		// 	})
		// 	.catch((e: any) => {
		// 		console.log("Catch")
		// 		console.log(e)
		// 	})
	}

	// private get configArgs(): string {
	// 	const configPath = PathHelper.getLastPackageJsonForFile(this.fileUrl)
	// 	// let configJson = ""
	// 	// if (configPath) {
	// 	// 	configJson = fs.readFileSync(configPath, "UTF-8")
	// 	// }
	// 	return `-c=${configPath}`
	// }
}