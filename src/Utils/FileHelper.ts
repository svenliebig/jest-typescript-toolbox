import * as vscode from "vscode"
import * as path from "path"

export default class FileHelper {

	/**
	 * Returns a filename from a whole filepath. Example returns  `hello.ts` part of `c:\documents\world\hello.ts`
	 *
	 * @static
	 * @param {string} filePath The file path, example  `c:\documents\world\hello.ts`
	 * @returns {string} The cutted filename, example  `hello.ts`
	 * @memberof FileHelper
	 */
	public static getFileName(filePath: string): string {
		return filePath.split(path.sep).pop() || ""
	}

	public static isTypeScriptFile = (doc: vscode.TextDocument): boolean => {
		const { languageId } = doc
		return languageId === "typescriptreact" || languageId === "typescript"
	}

	/**
	 *
	 *
	 * @static
	 * @memberof FileHelper
	 * 
	 * @todo may this is a redudant check
	 */
	public static isTypeScriptTestFile = (doc: vscode.TextDocument): boolean => {
		if (FileHelper.isTypeScriptFile(doc)) {
			const { fileName } = doc
			const regex = new RegExp("(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$")
			const result = regex.exec(fileName)
			if (result) {
				return true
			}
		}
		return false
	}

}