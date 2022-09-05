
// Import core Angular modules.
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

// Import application modules.
import { MeterComponent } from "./meter.component";
import { UrlStateService } from "./url-state.service";

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
	// Angular that I expect the core Angular directives to be available in the templates.
	// As such, I have to explicitly include the CommonModule, which provides directives
	// like `ngIf` and `ngForOf`, in this component's imports.
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

	private urlStateService: UrlStateService;

	public baseWeight: number;
	public form: {
		baseWeight: string;
	};
	public segments: Segment[];
	public total: number;

	// I initialize the root component.
	constructor( urlStateService: UrlStateService ) {

		this.urlStateService = urlStateService;

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
	* I apply the current base-weight form value to the overall weight total.
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
	* I get called once after the component inputs have been bound for the first time.
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
	* This allows the current weight plate confirmation to be shareable with others.
	*/
	private statePullFromUrl() : void {

		var state = this.urlStateService.get();

		this.baseWeight = ( state[ "baseWeight" ] || 0 );
		this.form.baseWeight = String( this.baseWeight || "" );

		// The state is just a set of key-value pairs in which the values are numeric. As
		// such, let's iterate over our segments to see if there is a corresponding state
		// key for the given weight.
		for ( var segment of this.segments ) {

			segment.count = ( state[ segment.weight ] || 0 );

		}

		this.setTotal();

	}


	/**
	* I persist the current plate configuration to the URL fragment so that the current
	* state can be shared.
	*/
	private statePushToUrl() : void {

		this.urlStateService.set( this.baseWeight, this.segments );

	}

}
