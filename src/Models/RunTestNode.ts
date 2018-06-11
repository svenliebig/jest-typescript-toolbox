import BaseNode from "./BaseNode"
import Icons from "../Utils/Icons"
import * as vscode from "vscode"
import RunJestTest from "../Commands/RunJestTest"

export default class RunTestNode extends BaseNode {
	public testRunning: boolean
	public duration: number | null = null

	constructor(private fileUrl: string) {
		super("Run this test", "jest-test-runner-node")
		this.testRunning = false
	}

	public get properties(): vscode.TreeItem {
		return {
			label: this.getLabel(),
			iconPath: this.testRunning ? Icons.getGif("pending") : Icons.get("play"),
			command: this.testRunning ? undefined : new RunJestTest(this.fileUrl)
		}
	}

	public setDuration(duration: number): void {
		this.duration = duration
	}

	private getLabel(): string {
		let label = ""

		label += this.label

		if (this.duration) {
			label += ` (${this.duration} ms)`
		}

		return label
	}
}