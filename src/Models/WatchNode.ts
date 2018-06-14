import BaseNode from "./BaseNode"
import { TreeItem } from "vscode"
import Icons from "../Utils/Icons"
import Commands from "../Commands"

export default class WatchNode extends BaseNode {
	public enabled: boolean = false

	constructor() {
		super(`Watch Mode`, `watch-test-node`)
	}

	public get properties(): TreeItem {
		return {
			tooltip: "Executes the test after saving the implementation or the test file",
			label: this.label,
			iconPath: this.icon,
			command: new Commands.ToggleWatch()
		}
	}

	protected get icon(): string | undefined {
		return this.enabled ? Icons.get("checkbox-checked") : Icons.get("checkbox-unchecked")
	}
}