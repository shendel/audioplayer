import React, { Component } from 'react';
import AudioPlayerPlayListItem from './PlayListItem';
import './PlayList.css';
class AudioPlayerPlayList extends Component {
	constructor(props) {
		super(props);
		this.root = props.root;
		this.FilterInputRef = React.createRef();
		this.state = {
			playlist : this.root.state.playlist
		}
		this.onFilterFocus = this.onFilterFocus.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);
	}
	onFilterFocus(e) {
		this.FilterInputRef.current.setSelectionRange(0, this.FilterInputRef.current.value.length );
	}
	onFilterChange(e) {
		for (var index in this.state.playlist) {
			this.checkTrackIsFiltered( this.state.playlist[index] );
		}
	}
	checkTrackIsFiltered(trackData) {
		if (!this.FilterInputRef.current) return true;
		
		if (this.FilterInputRef.current.value.length) {
			if (!(trackData.artist.toLowerCase().startsWith(this.FilterInputRef.current.value.toLowerCase())
				|| trackData.title.toLowerCase().startsWith(this.FilterInputRef.current.value.toLowerCase())
			)) {
				trackData.ref.current.setState( { hidden : true } );
				return true;
			}
		}
		trackData.ref.current.setState( { hidden : false } );
		return false;
	}
	updateListItemState(index) {
		this.state.playlist[index].ref.current.setState( { duration : this.state.playlist[index].time } );
	}
	render() {
		const listItems = this.state.playlist.map( (function (item,index) {
			const key = "playlist_"+index;
			if (!item.ref) {
				item.ref = React.createRef();
			}

			return <AudioPlayerPlayListItem 
					root={this.root}
					ref={item.ref}
					hidden={false}
					title={item.title} 
					artist={item.artist} 
					duration={item.time} 
					index={index} 
					key={key} />
		}).bind(this) );
		
		return (
			<div className="audio-player-playlist">
				<input className="filter-tracks" 
					type="text" 
					onChange={this.onFilterChange}
					onFocus={this.onFilterFocus}
					ref={this.FilterInputRef} />
				<div>
				{listItems}
				</div>
			</div>
		);
	}
}

export default AudioPlayerPlayList;