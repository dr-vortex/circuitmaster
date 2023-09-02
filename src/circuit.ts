import { Load, LoadType } from './load';

export enum CircuitType {
	NONE,
	SERIES,
	PARALLEL,
}

export namespace Circuit {
	export interface JSON extends Load.JSON {
		circuitType: CircuitType;
		loads: Load.JSON[];
	}
}
export class Circuit<T extends CircuitType = CircuitType> extends Load<LoadType.CIRCUIT> {
	loads: Load[] = [];

	get voltage(): number {
		if (!this._voltage) {
			this.solve();
		}
		return this._voltage;
	}
	set voltage(value: number) {
		this._voltage = value;
	}

	get current(): number {
		if (!this._current) {
			this.solve();
		}
		return this._current;
	}
	set current(value: number) {
		this._current = value;
	}

	get resistance(): number {
		if (!this._resistance) {
			this.solve();
		}
		return this._resistance;
	}
	set resistance(value: number) {
		this._resistance = value;
	}

	private _isSolved = false;
	get isSolved(): boolean {
		return this._isSolved;
	}

	constructor(public circuitType: T) {
		super(LoadType.CIRCUIT);
	}

	solve(isSolvingCircuit = false): void {
		if (this._isSolved) {
			switch (this.circuitType) {
				case CircuitType.SERIES:
					this._voltage = this.loads.reduce((total, load) => (total += load.voltage), 0);
					this._current = this.loads.find(load => !Number.isNaN(load.current))?.current ?? NaN;
					break;
				case CircuitType.PARALLEL:
					this._voltage = this.loads.find(load => !Number.isNaN(load.voltage))?.voltage ?? NaN;
					this._current = this.loads.reduce((total, load) => (total += load.voltage), 0);
					break;
			}
			super.solve();
			return;
		}
		if (this.circuitType == CircuitType.SERIES) {
			if (Number.isNaN(this._voltage)) {
				this._voltage = 0;
			}
			if (Number.isNaN(this._resistance)) {
				this._resistance = 0;
			}
		}
		if (this.circuitType == CircuitType.PARALLEL) {
			if (Number.isNaN(this._current)) {
				this._current = 0;
			}
		}
		for (const load of this.loads) {
			if (this.circuitType == CircuitType.SERIES) {
				if (Number.isNaN(this._current)) {
					this._current = load.current;
				}
				load.current = this._current;
			}
			if (this.circuitType == CircuitType.PARALLEL) {
				if (Number.isNaN(this._voltage)) {
					this._voltage = load.voltage;
				}
				load.voltage = this._voltage;
			}
			load.solve(true);
			if (this.circuitType == CircuitType.SERIES) {
				this._voltage += load.voltage;
				this._resistance += load.resistance;
			}
			if (this.circuitType == CircuitType.PARALLEL) {
				this._current += load.current;
			}
		}
		super.solve();
		if (!isSolvingCircuit) {
			this._circuit?.solve();
		}
		this._isSolved = true;
	}

	clear() {
		super.clear();
		for (const load of this.loads) {
			load.clear();
		}
		this._isSolved = false;
	}

	toJSON(): Circuit.JSON {
		return Object.assign(super.toJSON(), {
			loads: this.loads.map(load => load.toJSON()),
			circuitType: this.circuitType,
		});
	}

	static FromJSON(json: Circuit.JSON, circuit: Circuit = new Circuit(CircuitType.NONE)): Circuit {
		super.FromJSON(json, circuit);
		circuit.circuitType = json.circuitType;
		for (const loadJSON of json.loads) {
			const load = Load.FromJSON(loadJSON);
			load._circuit = circuit;
			circuit.loads.push(load);
		}
		return circuit;
	}
}
