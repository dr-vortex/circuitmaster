import $ from 'jquery';
import { Circuit, CircuitType } from '../circuit';
import { LoadUI } from './load';
import { Load, LoadType } from '../load';

export class CircuitUI extends LoadUI {
	constructor(public target: Circuit) {
		super(target);
		const typeSelect = $('<select></select>')
			.addClass('circuitType')
			.on('change', e => {
				const selected = ($(e.target as HTMLSelectElement).val() as string) ?? '0';
				target.circuitType = parseInt(selected);
				this.update();
			})
			.appendTo(this);
		for (const [key, value] of Object.entries(CircuitType)) {
			if (key == (+key).toString()) {
				continue;
			}

			$('<option></option>').attr({ value }).text(key.toLowerCase()).appendTo(typeSelect);
		}
		const loads = $('<div></div>').addClass('loads').appendTo(this);
		$('<p></p>').text('Loads:').appendTo(loads);
		$('<p></p>').text('Add:').appendTo(this);
		const addSelect = $('<select></select>')
			.addClass('add')
			.on('change', e => {
				const selected = ($(e.target as HTMLSelectElement).val() as string) ?? '0';
				const type = parseInt(selected);
				switch (type) {
					case LoadType.BASIC:
						const newLoad: Load = new Load(LoadType.BASIC);
						target.loads.push(newLoad);
					case LoadType.CIRCUIT:
						const newCircuit = new Circuit(CircuitType.NONE);
						target.loads.push(newCircuit);
					default:
						alert('Not supported');
				}
				this.update();
			})
			.appendTo(this);
		for (const [key, value] of Object.entries(LoadType)) {
			if (key == (+key).toString()) {
				continue;
			}

			$('<option></option>').attr({ value }).text(key.toLowerCase()).appendTo(addSelect);
		}
		this.update();
	}

	update() {
		super.update();
		$(this).find('.circuitType').val(this.target.circuitType);
		$(this)
			.find<LoadUI>('.loads>.LoadUI')
			.each((i, ui: LoadUI) => {
				if (!this.target.loads.includes(ui.target)) {
					ui.remove();
				}
			});
		const loadUIs = [...$(this).find<LoadUI>('.loads>.LoadUI')];
		for (const load of this.target.loads) {
			if (!loadUIs.some(ui => ui.target === load)) {
				const ui = load.loadType == LoadType.CIRCUIT ? new CircuitUI(load as Circuit) : new LoadUI(load);
				$(this).find('.loads').append(ui);
				loadUIs.push(ui);
			}
		}

		for (const ui of loadUIs) {
			ui.update();
		}
	}
}
customElements.define('ui-circuit', CircuitUI);
