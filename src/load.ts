export enum LoadType {
	BASIC,
	CIRCUIT,
}

export interface LoadJSON {
	voltage?: number;
	current?: number;
	resistance?: number;
}

export class Load<T extends LoadType = LoadType> implements LoadJSON {
	protected _voltage: number = 0;
	protected _current: number = 0;
	protected _resistance: number = 0;
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

	toJSON(): LoadJSON {
		return {
			voltage: this.voltage,
			current: this.current,
			resistance: this.resistance,
		};
	}

	static FromJSON(json: LoadJSON, load: Load = new Load(LoadType.BASIC)): Load {
		load.voltage = json.voltage;
		load.current = json.current;
		load.resistance = json.resistance;
		return load;
	}
}

export function solveLoadUnknowns<T extends LoadType>(load: LoadJSON): Load<T> {
	if (typeof load.current == 'number' && typeof load.resistance == 'number') {
		load.voltage = load.current * load.resistance;
	}

	if (typeof load.voltage == 'number' && typeof load.resistance == 'number') {
		load.current = load.voltage / load.resistance;
	}

	if (typeof load.voltage == 'number' && typeof load.current == 'number') {
		load.resistance = load.voltage / load.current;
	}

	return load as Load<T>;
}
