import PathHelper from "../Utils/PathHelper"
const jest = require("jest")

export default class JestRunner {
	constructor(private fileUrl: string) {
	}

	public createTestRun() {
		jest.run(["--rootDir e:\\workspace\\time\\web", this.configArgs, this.fileUrl])
			.then((e: any) => {
				console.log(e)
			})
			.catch((e: any) => {
				console.log(e)
			})
	}

	private get configArgs(): string {
		return `-c ${PathHelper.getLastPackageJsonForFile(this.fileUrl)}`
	}
}