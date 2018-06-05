import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"

export default class PathHelper {

	constructor() {
	}

	public static getLastPackageJsonForFile(fileUrl: string): string | null {
		const projectRoot = vscode.workspace.rootPath!
		let currentRoot = projectRoot
		let lastPackageJson: null | string = null

		// magic

		let subFolder = fileUrl.split(projectRoot)

		if (subFolder.length === 2) {
			subFolder = subFolder[1].split(path.sep)
		}

		subFolder.forEach(folder => {
			currentRoot = path.join(currentRoot, folder)
			console.log("checking for package json in: ", currentRoot)
			const possiblePackageJsonPath = path.join(currentRoot, "package.json")
			const exists = fs.existsSync(path.join(possiblePackageJsonPath))
			console.log("result: ", exists)
			if (exists) {
				lastPackageJson = possiblePackageJsonPath
			}
		})

		console.log("lastPackageJsonPath is: ", lastPackageJson)
		// if (lastPackageJson && path.sep === "\\") {
		// 	return lastPackageJson!.replace(/\\/g, "\\\\")
		// }
		return lastPackageJson
	}
}