
// Import core Angular modules.
import { Injectable } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export interface State {
	[ key: string ]: number;
}

export interface Segment {
	weight: number;
	count: number
}

@Injectable({
	providedIn: "root"
})
export class UrlStateService {

	/**
	* I split the location fragment into a dictionary of key:value pairs in which the
	* values are all numbers.
	*/
	public get() : State {

		var state = Object.create( null );
		
		for ( var setting of window.location.hash.slice( 1 ).split( ";" ) ) {

			var parts = setting.split( ":" );
			var name = parts[ 0 ];
			var value = ( +parts[ 1 ] || 0 );

			state[ name ] = value;

		}

		return( state );

	}


	/**
	* I store the given weights into the location fragment.
	*/
	public set(
		baseWeight: number,
		segments: Segment[]
		) : void {

		window.location.hash = segments.reduce(
			( reduction, segment ) => {

				return( `${ reduction };${ segment.weight }:${ segment.count }` );

			},
			`baseWeight:${ baseWeight }`
		);

	}

}
