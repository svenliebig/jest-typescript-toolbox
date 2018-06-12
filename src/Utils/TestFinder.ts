import * as vscode from "vscode"
import * as path from "path"

const lastDotRegex = /.([^.]*)$/

export default class TestFinder {
	private testFilePatter: string | null

	constructor(file: vscode.TextDocument) {
		const lastSplitter = file.fileName.split(path.sep).pop()
		if (lastSplitter) {
			this.testFilePatter = lastSplitter.replace(lastDotRegex, ".test.$1")
		} else {
			this.testFilePatter = null
		}
	}

	public findRelatedTest(exclude: string = "/node_modules/**", max: number = 1): Promise<Array<vscode.Uri>> {
		return new Promise((resolve, reject) => {
			if (!this.testFilePatter) {
				return reject("No Testfilepattern to resolve.")
			}

			vscode.workspace.findFiles(`**/test/**/${this.testFilePatter}`, exclude, max)
				.then(resolve)
		})
	}
}