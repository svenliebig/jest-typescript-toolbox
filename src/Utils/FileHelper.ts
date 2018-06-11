import * as vscode from "vscode"

export default class FileHelper {

	public static isTypeScriptTestFile = (doc: vscode.TextDocument): boolean => {
		const { languageId, fileName } = doc
		if (languageId === "typescriptreact" || languageId === "typescript") {
			const regex = new RegExp("(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$")
			const result = regex.exec(fileName)
			if (result) {
				return true
			}
		}
		return false
	}

}