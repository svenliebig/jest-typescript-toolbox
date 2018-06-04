import * as path from "path"

export default class Icons {
	public static get(icon: string) {
		return path.join(__dirname, "..", "..", "assets", `${icon}.svg`)
	}
}