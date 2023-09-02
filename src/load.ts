import type { Circuit } from './circuit';

export enum LoadType {
	BASIC,
	CIRCUIT,
}

export class Load<T extends LoadType = LoadType> implements Load.JSON {
	_circuit: Circuit;
	protected _voltage = 0;
	protected _current = 0;
	protected _resistance = 0;
	get voltage(): number {
		return this._voltage;
	}
	set voltage(value: number) {
		this._voltage = value;
	}
	get current(): number {
		return this._current;
	}
	set current(value: number) {
		this._current = value;
	}
	get resistance(): number {
		return this._resistance;
	}
	set resistance(value: number) {
		this._resistance = value;
	}

	get loadType(): T {
		return this._loadType;
	}
	constructor(protected _loadType: T) {}

	solve(isSolvingCircuit = false): void {
		if (!Number.isNaN(this._current) && !Number.isNaN(this._resistance)) {
			this._voltage = this._current * this._resistance;
		}

		if (!Number.isNaN(this._voltage) && !Number.isNaN(this._resistance)) {
			this._current = this._voltage / this._resistance;
		}

		if (!Number.isNaN(this._voltage) && !Number.isNaN(this._current)) {
			this._resistance = this._voltage / this._current;
		}

		if (!isSolvingCircuit) {
			this._circuit?.solve();
		}
	}

	clear(): void {
		this.voltage = NaN;
		this.current = NaN;
		this.resistance = NaN;
	}

	toJSON(): Load.JSON {
		return {
			voltage: this.voltage,
			current: this.current,
			resistance: this.resistance,
		};
	}

	static FromJSON(json: Partial<Load.JSON>, load: Load = new Load(LoadType.BASIC)): Load {
		load.voltage = json.voltage ?? NaN;
		load.current = json.current ?? NaN;
		load.resistance = json.resistance ?? NaN;
		return load;
	}
}

export namespace Load {
	export interface JSON {
		voltage: number;
		current: number;
		resistance: number;
	}
}
