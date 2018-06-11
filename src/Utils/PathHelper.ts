import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"

export default class PathHelper {
	private event = new vscode.EventEmitter<string>()

	private lastPackageJson: string | undefined

	constructor() {
	}

	public getRelativeFilePathToWorkspaceRoot(fileUrl: string, projectRoot: string): string {
		let subFolder = fileUrl.split(projectRoot)
		const folder = subFolder[1].replace(/\\/g, "/")
		return `./${folder}`
	}

	public getLastPackageJsonForFile(fileUrl: string): string | null {
		if (this.lastPackageJson) {
			if (fs.existsSync(this.lastPackageJson)) {
				return this.lastPackageJson
			}
		}

		const projectRoot = vscode.workspace.rootPath!
		let currentRoot = projectRoot
		let lastPackageJson: null | string = null

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

		if (!lastPackageJson) {
			this.event.fire()
		}

		return lastPackageJson
	}

	public escapeWindowsString(str: string): string {
		return this.escapeWindowsSpaces(this.escapeWindowsBackslashes(str))
	}

	public escapeWindowsSpaces(str: string): string {
		return str.replace(/([^`])(\s)/g, (a, b, c) => `${b}\`${c}`)
	}

	public escapeWindowsBackslashes(str: string): string {
		return str.replace(/\\/g, "\\\\")
	}
}