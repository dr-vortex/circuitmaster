import { Load, LoadJSON, LoadType, solveLoadUnknowns } from './load';

export enum CircuitType {
	NONE,
	SERIES,
	PARALLEL,
}

export interface CircuitJSON extends LoadJSON {
	circuitType: CircuitType;
	loads: LoadJSON[];
}

export class Circuit<T extends CircuitType = CircuitType> extends Load<LoadType.CIRCUIT> {
	loads: Load[];

	get voltage(): number {
		if (!this._voltage) {
			this.solve();
		}
		return this._voltage;
	}

	get current(): number {
		if (!this._current) {
			this.solve();
		}
		return this._current;
	}

	get resistance(): number {
		if (!this._resistance) {
			this.solve();
		}
		return this._resistance;
	}

	private _isSolved: boolean = false;
	get isSolved(): boolean {
		return this._isSolved;
	}

	constructor(public circuitType: T) {
		super(LoadType.CIRCUIT);
	}

	solve(): void {
		if (this._isSolved) {
			return;
		}
		for (const load of this.loads) {
			if (this.circuitType == CircuitType.SERIES) {
				this._current ||= load.current;
			}
			if (this.circuitType == CircuitType.PARALLEL) {
				this._voltage ||= load.voltage;
			}
			switch (load.loadType) {
				case LoadType.BASIC:
					solveLoadUnknowns(load);
					break;
				case LoadType.CIRCUIT:
					if (!(load instanceof Circuit)) {
						throw new TypeError('Load with type circuit is not a circuit');
					}

					load.solve();
			}
			if (this.circuitType == CircuitType.SERIES) {
				this._voltage += load.voltage;
				this._resistance += load.resistance;
			}
			if (this.circuitType == CircuitType.PARALLEL) {
				this._current += load.current;
			}
		}
		if (this.circuitType == CircuitType.PARALLEL) {
			this._resistance = this._voltage / this._current;
		}
		this._isSolved = true;
	}

	toJSON(): CircuitJSON {
		return Object.assign(super.toJSON(), {
			loads: this.loads.map(load => load.toJSON()),
			circuitType: this.circuitType,
		});
	}

	static FromJSON(json: CircuitJSON, circuit: Circuit = new Circuit(CircuitType.NONE)): Circuit {
		super.FromJSON(json, circuit);
		circuit.circuitType = json.circuitType;
		return circuit;
	}
}
