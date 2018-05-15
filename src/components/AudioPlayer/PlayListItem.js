import React, { Component } from 'react';
import './PlayListItem.css';

class AudioPlayerPlayListItem extends Component {
	constructor(props) {
		super(props);
		this.root = props.root;
		this.index = props.index;
		this.state = {
			artist : props.artist,
			title : props.title,
			hidden: props.hidden,
			duration : props.duration
		}
		this.onItemClick = this.onItemClick.bind(this);
	}
	onItemClick(e) {
		e.preventDefault();
		if (this.root.state.currentTrack===this.index) {
			this.root.controlPlayPause();
		} else {
			this.root.setState( {
				currentTrack : this.index
			} , (function () {
				this.root.beginPlayNewTrack();
			}).bind(this) );
		}
	}
	render() {
		var className = ["audio-player-playlist-item"];
		var duration = this.state.duration;
		if (this.index===this.root.state.currentTrack) {
			className.push("-active");
			duration = this.state.duration - this.root.state.currentTime;
		}
		if (this.state.hidden) className.push("-hidden");
		
		duration = Math.round(duration);
		var duration_minutes = (duration - duration % 60)/60;
		var duration_seconds = duration % 60;
		var duration_view = duration_minutes+":"+((duration_seconds<10) ? "0"+duration_seconds : duration_seconds);
		if (this.root.isHTMLAudioInited() && (this.index===this.root.state.currentTrack)) {
			duration_view = "-"+duration_view;
		}
		return (
			<div className={className.join(" ")} onClick={this.onItemClick}>
				<b>{duration_view}</b>
				<em>{this.state.artist} - {this.state.title}</em>
			</div>
		);
	}
}

export default AudioPlayerPlayListItem;