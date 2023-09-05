import { Load } from '../load';
import { UIComponent } from './component';
import $ from 'jquery';

export class LoadUI extends UIComponent<Load> {
	constructor(public target: Load) {
		super(target);

		$('<span> V: </span>').addClass('voltage').appendTo(this);
		$('<span> I: </span>').addClass('current').appendTo(this);
		$('<span> R: </span>').addClass('resistance').appendTo(this);
		$('<input></input>').attr('size', '').appendTo($(this).find('.voltage,.current,.resistance'));
		$(this)
			.find('>span>input')
			.on('change', e => {
				const t = e.target as HTMLInputElement;
				target[$(t).parent('span')[0].classList[0]] = parseFloat(t.value);
				target.solve();
				this.update();
			});
		this.update();
	}

	update() {
		for (const attr of ['voltage', 'current', 'resistance']) {
			const value = Number.isNaN(this.target[attr]) ? '' : this.target[attr].toString();
			$(this).find(`>.${attr} input`).val(value).attr('size', value.length + 1);
		}
	}
}
customElements.define('ui-load', LoadUI);
