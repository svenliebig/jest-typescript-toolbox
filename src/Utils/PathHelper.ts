import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"

export default class PathHelper {
	private lastPackageJson: string | null = null
	private rootFolder: string | null = null

	public getRelativeFilePathToWorkspaceRoot(fileUrl: string, projectRoot: string): string {
		let subFolder = fileUrl.split(projectRoot)
		const folder = subFolder[1].replace(/\\/g, "/")
		return `./${folder}`
	}

	public getRootDirForFile(fileUrl: string): string | null {
		if (this.rootFolder) {
			if (fs.existsSync(this.rootFolder)) {
				return this.rootFolder
			}
		}

		const projectRoot = vscode.workspace.rootPath!
		let currentRoot = projectRoot

		let subFolder = fileUrl.split(projectRoot)

		if (subFolder.length === 2) {
			subFolder = subFolder[1].split(path.sep)
		}

		subFolder.forEach(folder => {
			currentRoot = path.join(currentRoot, folder)
			const possiblePackageJsonPath = path.join(currentRoot, "package.json")
			const exists = fs.existsSync(path.join(possiblePackageJsonPath))
			if (exists) {
				this.rootFolder = currentRoot
			}
		})

		return this.rootFolder
	}

	public getLastPackageJsonForFile(fileUrl: string): string | null {
		if (this.lastPackageJson) {
			if (fs.existsSync(this.lastPackageJson)) {
				return this.lastPackageJson
			}
		}

		const rootDir = this.getRootDirForFile(fileUrl)

		if (!rootDir) {
			return null
		}

		this.lastPackageJson = path.join(rootDir, "package.json")
		console.log(`last package json`, this.lastPackageJson)
		return this.lastPackageJson
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