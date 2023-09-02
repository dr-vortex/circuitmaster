import $ from 'jquery';
import { Circuit, CircuitType } from '../circuit';
import { LoadUI } from './load';

export class CircuitUI extends LoadUI {
	constructor(public target: Circuit) {
		super(target);
		const select = $('<select></select>')
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

			$('<option></option>').attr({ value }).text(key.toLowerCase()).appendTo(select);
		}
		const loads = $('<div></div>').addClass('loads').appendTo(this);
		$('<p></p>').text('Loads:').appendTo(loads);
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
				const ui = new LoadUI(load);
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
