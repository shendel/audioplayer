import React, { Component } from 'react';
import './Controls.css';


class AudioPlayerControls extends Component {
	constructor(props) {
		super(props);
		this.root 					= props.root;
		this.onClickPrevTrack 		= this.onClickPrevTrack.bind(this);
		this.onClickNextTrack 		= this.onClickNextTrack.bind(this);
		this.onClickPlayPause 		= this.onClickPlayPause.bind(this);
		this.onClickMute			= this.onClickMute.bind(this);
		this.onClickTimeSeek		= this.onClickTimeSeek.bind(this);
		this.onClickVolumeLevel 	= this.onClickVolumeLevel.bind(this);
		this.updateStateTick		= this.updateStateTick.bind(this);
		
		this.updateStateTickTimer	= 0;
		
		this.DOM_timeSeekROOT		= React.createRef();
		this.DOM_timeSeekEM 		= React.createRef();
		
		this.DOM_volumeLevelROOT	= React.createRef();
		this.DOM_volumeLevelEM		= React.createRef();
	}
	componentDidMount() {
		this.updateStateTickTimer = setInterval( this.updateStateTick , 1000 );
		this.setCurrentVolumeLevelView( this.root.getCurrentVolumeLevel() * 100 );
	}

	componentWillUnmount() {
		clearInterval( this.updateStateTickTimer );
	}
	updateStateTick() {
		if (!this.root.isPaused()) {
			this.setCurrentTimeSeekView(this.root.getCurrentTimePercent());
		}
	}
	onClickPrevTrack(e) {
		e.preventDefault();
		this.root.controlPlayPrev();
	}
	onClickNextTrack(e) {
		e.preventDefault();
		this.root.controlPlayNext();
	}
	onClickPlayPause(e) {
		e.preventDefault();
		this.root.controlPlayPause();
	}
	onClickMute(e) {
		e.preventDefault();
		this.root.controlMute();
	}
	UTIL_getDOMOffset(StartDom) {
		if (StartDom.offsetParent!==null) {
			return StartDom.offsetLeft + this.UTIL_getDOMOffset(StartDom.offsetParent);
		} else {
			return StartDom.offsetLeft;
		}
	}
	onClickTimeSeek(e) {
		e.preventDefault();
		var domWidth = this.DOM_timeSeekROOT.current.clientWidth;
		var clickWidth = e.clientX - this.UTIL_getDOMOffset(this.DOM_timeSeekROOT.current);
		var percents = Math.round(clickWidth/domWidth*100);
		this.setCurrentTimeSeekView(percents);
		this.root.controlTimeSeek(percents);
	}
	setCurrentTimeSeekView(percents) {
		this.DOM_timeSeekEM.current.style.width = percents+"%";
	}
	
	onClickVolumeLevel(e) {
		e.preventDefault();
		var domWidth = this.DOM_volumeLevelROOT.current.clientWidth;
		var clickWidth = e.clientX -  this.UTIL_getDOMOffset(this.DOM_volumeLevelROOT.current);
		var percents = Math.round(clickWidth/domWidth*100);
		this.setCurrentVolumeLevelView(percents);
		this.root.controlVolumeLevel(percents);
	}
	setCurrentVolumeLevelView(percents) {
		this.DOM_volumeLevelEM.current.style.width = percents+"%";
	}
	getCurrentVolumeLevel() {
		return parseInt(this.DOM_volumeLevelEM.current.style.width,10);
	}
	
	render() {
		var className = [ "audio-player-contols" ];
		if (this.root.isPaused()) className.push("-paused");
		if (this.root.isMuted()) className.push("-muted");
		return (
			<div className={className.join(" ")}>
				<a className="prev" 
					onClick={this.onClickPrevTrack}>
					<em>Prev track</em>
				</a>
				<a className="play-pause" 
					onClick={this.onClickPlayPause}>
					<em>Play/Pause</em>
				</a>
				<a className="next" 
					onClick={this.onClickNextTrack}>
					<em>Next track</em>
				</a>
				<a className="volume-level" 
					ref={this.DOM_volumeLevelROOT} 
					onClick={this.onClickVolumeLevel}>
					<em ref={this.DOM_volumeLevelEM}>Volute level</em>
				</a>
				<a className="mute" 
					onClick={this.onClickMute}>
					<em>Mute/Unmute</em>
				</a>
				<a className="time-seek" 
					ref={this.DOM_timeSeekROOT} 
					onClick={this.onClickTimeSeek}>
					<em ref={this.DOM_timeSeekEM}>Time seek</em>
				</a>
			</div>
		);
	}
}

export default AudioPlayerControls;