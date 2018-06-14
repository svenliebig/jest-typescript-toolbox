import { EventEmitter, Event } from "vscode"

export default class EventListener {
	private _onRunTest = new EventEmitter<undefined>()
	get onRunTest(): Event<undefined> {
		return this._onRunTest.event
	}
}