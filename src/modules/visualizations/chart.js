/*
Imports
*/

import * as D3 from "D3";

class Chart {
	id 			= undefined;
	svg			= undefined;
	width		= undefined;
	height		= undefined;
	margin		= undefined;
	palette		= undefined;
	data		= undefined;
	inner		= undefined;
	uid			= undefined;
	annotation	= undefined;

	constructor (config) {

		// Configurable Parameters
		this.id 		= config.id;
		this.width 		= config.width;
		this.height 	= config.height;
		this.margin		= config.margin;
		this.palette 	= config.palette;
		this.data 		= config.data;

		// Computed References
		this.inner 		= {
			height			: this.height - this.margin.top - this.margin.bottom,
			width			: this.width -  this.margin.left - this.margin.right,
			top				: this.margin.top,
			left			: this.margin.left,
			bottom			: this.height - this.margin.bottom,
			right			: this.width - this.margin.right,
		};
		this.uid 		= this.#uid();

	}

	#uid () {
		return `O-${Math.random().toString(16).slice(2, 8)}`;
	}

	asString (val) {
		return String(val);
	}

	asNumber (val) {
		return Number(val);
	}

	asDate (val) {
		return new Date(val);
	}

	asType (type, val) {
		return this[`as${type}`](val);
	}

	tokenize (token) {
		return (typeof(token) === "string") ? token.replace(/\s/g, "-").toLowerCase() : `${Math.random().toString(16).slice(2, 6)}`.toLowerCase();
	}

	debug () {
		console.info(this);
		return this;
	}

}

export default Chart;
