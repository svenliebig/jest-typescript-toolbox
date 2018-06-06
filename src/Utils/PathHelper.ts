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
			const possiblePackageJsonPath = path.join(currentRoot, "package.json")
			const exists = fs.existsSync(path.join(possiblePackageJsonPath))
			if (exists) {
				lastPackageJson = possiblePackageJsonPath
			}
		})

		// if (lastPackageJson && path.sep === "\\") {
		// 	return lastPackageJson!.replace(/\\/g, "\\\\")
		// }
		return lastPackageJson
	}
}