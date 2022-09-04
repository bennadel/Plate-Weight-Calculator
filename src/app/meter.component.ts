
// Import core Angular modules.
import { ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	standalone: true,
	selector: "app-meter",
	inputs: [ "value" ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ CommonModule ],
	templateUrl: "./meter.component.html",
	styleUrls: [ "./meter.component.less" ]
})
export class MeterComponent {

	public readings: number[];
	public value!: number;

	// I initialize the meter component.
	constructor() {

		this.readings = [];

	}

	// ---
	// PUBLIC METHODS.
	// ---

	/**
	* I get called when the inputs bindings are first bound or updated.
	*/
	public ngOnChanges() : void {

		this.setReadings();

	}

	// ---
	// PRIVATE METHODS.
	// ---

	/**
	* I populate the readings based on the current view-model.
	*/
	private setReadings() : void {

		this.readings = [];

		for ( var i = 1 ; i <= this.value ; i++ ) {

			this.readings.push( i );

		}

	}

}
