import $ from 'jquery';

export abstract class UIComponent<T> extends HTMLElement {
	constructor(public target: T) {
		super();
		$(this).addClass(this.constructor.name);
	}

	abstract update(): void;
}
