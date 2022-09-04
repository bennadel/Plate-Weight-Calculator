
// Import core Angular modules.
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface Segment {
	name: string;
	weight: number;
	count: number;
	indicators: any[];
}

@Component({
	standalone: true,
	selector: "app-root",
	imports: [ CommonModule ],
	templateUrl: "./app.component.html",
	styleUrls: [ "./app.component.less" ]
})
export class AppComponent {

	public segments: Segment[];
	public total: number;

	constructor() {

		this.segments = [
			{
				name: "45",
				weight: 45,
				count: 0,
				indicators: []
			},
			{
				name: "25",
				weight: 25,
				count: 0,
				indicators: []
			},
			{
				name: "10",
				weight: 10,
				count: 0,
				indicators: []
			},
			{
				name: "5",
				weight: 5,
				count: 0,
				indicators: []
			},
			{
				name: "2.5",
				weight: 2.5,
				count: 0,
				indicators: []
			}
		];
		this.total = 0;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public addPlate( segment: Segment ) : void {

		segment.count++;
		segment.indicators.push( segment.count );
		this.setTotal();

	}


	public clearPlates() : void {

		for ( var segment of this.segments ) {

			segment.count = 0;
			segment.indicators = [];

		}

		this.setTotal();

	}


	public removePlate( segment: Segment ) : void {

		if ( segment.count ) {

			segment.count--;
			segment.indicators.pop();
			this.setTotal();

		}

	}

	// ---
	// PRIVATE METHODS.
	// ---

	private setTotal() : void {

		this.total = this.segments.reduce(
			( reduction, segment ) => {

				return( reduction + ( segment.weight * segment.count ) );

			},
			0
		);

	}

}
