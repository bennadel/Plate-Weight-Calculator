
// Import core Angular modules.
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

// Import application modules.
import { MeterComponent } from "./meter.component";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface Segment {
	name: string;
	weight: number;
	count: number;
}

@Component({
	standalone: true,
	selector: "app-root",
	// NOTE: Because I am not using a root module, there's nothing that inherently tells
	// Angular that I expect the core directives to be available. As such, I have to
	// include the CommonModule, which provides directives like `ngIf` and `ngForOf`.
	imports: [
		CommonModule,
		FormsModule,
		// OH SNAP, I'm pulling in local, application components as well!
		MeterComponent
	],
	templateUrl: "./app.component.html",
	styleUrls: [ "./app.component.less" ]
})
export class AppComponent {

	public baseWeight: number;
	public form: {
		baseWeight: string;
	};
	public segments: Segment[];
	public total: number;

	// I initialize the root component.
	constructor() {

		this.baseWeight = 0;
		this.segments = [
			this.buildSegment( 45 ),
			this.buildSegment( 25 ),
			this.buildSegment( 10 ),
			this.buildSegment( 5 ),
			this.buildSegment( 2.5 )
		];
		this.total = 0;
		this.form = {
			baseWeight: ""
		};

	}

	// ---
	// PUBLIC METHODS.
	// ---

	/**
	* I add a single plate to the given segment.
	*/
	public addPlate( segment: Segment ) : void {

		segment.count++;
		this.setTotal();
		this.statePushToUrl();

	}


	/**
	* I apply the given base-weight (input) value.
	*/
	public applyBaseWeight() : void {

		this.baseWeight = ( +this.form.baseWeight || 0 );
		this.setTotal();
		this.statePushToUrl();

	}


	/**
	* I remove all of the plates from all of the segments.
	*/
	public clearPlates() : void {

		for ( var segment of this.segments ) {

			segment.count = 0;

		}

		this.setTotal();
		this.statePushToUrl();

	}


	/**
	* I get called once after the inputs have been bound for the first time.
	*/
	public ngOnInit() : void {

		this.statePullFromUrl();

	}


	/**
	* I remove a single plate from the given segment.
	*/
	public removePlate( segment: Segment ) : void {

		if ( segment.count ) {

			segment.count--;
			this.setTotal();
			this.statePushToUrl();

		}

	}

	// ---
	// PRIVATE METHODS.
	// ---

	/**
	* I create an empty segment for the given weight-class.
	*/
	private buildSegment( weight: number ) : Segment {

		return({
			name: String( weight ),
			weight: weight,
			count: 0
		});

	}


	/**
	* I calculate and store the total based on the current view-model.
	*/
	private setTotal() : void {

		this.total = this.segments.reduce(
			( reduction, segment ) => {

				return( reduction + ( segment.weight * segment.count ) );

			},
			this.baseWeight
		);

	}


	/**
	* I pull state from the URL (fragment, hash), and use it to update the view-model.
	* This allows the current plate confirmation to be shareable.
	*/
	private statePullFromUrl() : void {

		for ( var setting of window.location.hash.slice( 1 ).split( ";" ) ) {

			var parts = setting.split( ":" );
			var name = parts[ 0 ];
			var value = ( +parts[ 1 ] || 0 );

			if ( name === "base" ) {

				this.baseWeight = value;
				this.form.baseWeight = String( value || "" );
				continue;

			}

			// Nested loops are usually meh, but in this case, I know that the array of
			// segments is really tiny, so a nested loop should be instantaneous even if
			// it's not the best strategy. Ideally, I'd create an "index" of the segments
			// based on weight; but then that's just another piece of data to manage.
			for ( var segment of this.segments ) {

				if ( segment.name === name ) {

					segment.count = value;
					continue;

				}

			}

		}

		this.setTotal();

	}


	/**
	* I persist the current plate configuration to the URL fragment so that the current
	* state can be shared.
	*/
	private statePushToUrl() : void {

		window.location.hash = this.segments.reduce(
			( reduction, segment ) => {

				return( `${ reduction };${ segment.name }:${ segment.count }` );

			},
			`base:${ this.baseWeight }`
		);

	}

}
