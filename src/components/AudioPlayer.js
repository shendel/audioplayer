import React, { Component } from 'react';
import AudioPlayerControls from './AudioPlayer/Controls.js';
import AudioPlayerPlayList from './AudioPlayer/PlayList.js';

class AudioPlayer extends Component {
	constructor(props) {
		super(props);
		
		this.DOM_audioHTMLElement 	= React.createRef();
		this.DOM_audioHTMLElementPrecache = React.createRef();
		
		this.ControlsRef			= React.createRef();
		this.PlayListRef			= React.createRef();
		
		
		this.state = {
			playlist : [
				/*
				{
					artist : "Buster brown",
					title : "Gonna make you happy 1943",
					source : "https://sampleswap.org/samples-ghost/%20MAY%202014%20LATEST%20ADDITIONS/PUBLIC%20DOMAIN%20MUSIC/626[kb]buster-brown-gonna-make-you-happy-1943.mp3.mp3",
					time : 0,
					precached : false
					
				},{
					artist : "John and Ruby Lomax 1939 Southern States Recordings",
					title : "Clapping Song capn dont low no truckin",
					source : "https://sampleswap.org/samples-ghost/%20MAY%202014%20LATEST%20ADDITIONS/PUBLIC%20DOMAIN%20MUSIC/John%20and%20Ruby%20Lomax%201939%20Southern%20States%20Recordings/219[kb]clapping-song_capn-dont-low-no-truckin.mp3.mp3",
					time : 0,
					precached : false
				},{
					artist : "John and Ruby Lomax 1939 Southern States Recordings",
					title : "Cornfield Holler",
					source : "https://sampleswap.org/samples-ghost/%20MAY%202014%20LATEST%20ADDITIONS/PUBLIC%20DOMAIN%20MUSIC/John%20and%20Ruby%20Lomax%201939%20Southern%20States%20Recordings/341[kb]cornfield-holler.mp3.mp3",
					time : 0,
					precached : false
				}
				*/
			],
			currentTrack : 0,
			currentPrecache : 0,
			muted : false,
			volume : 50,
			muted_lastVolume : 50,
			currentTime : 0,
			currentLenght: 0,
			paused : true
		};
		this.updateStateTickTimer  = 0;
		this.updateStateTick = this.updateStateTick.bind(this);
		this.onPrecachedAudio = this.onPrecachedAudio.bind(this);
		
		this.onTrackEnd = this.onTrackEnd.bind(this);
		
	}
	addTrack(artist,title,source) {
		this.setState( function (prevState) {
			prevState.playlist.push( { 
				artist : artist,
				title : title,
				source : source,
				time : 0,
				precached : false
			});
		} );
	}
	componentDidMount() {
		this.DOM_audioHTMLElement.current.pause();
		this.setState( { volume : this.DOM_audioHTMLElement.current.volume} );
		this.updateStateTickTimer = setInterval( this.updateStateTick , 1000 );
	}
	componentWillUnmount() {
		clearInterval( this.updateStateTickTimer );
	}
	/* Pre-cache audio data - length */
	onPrecachedAudio() {
		const updateListItem = this.state.currentPrecache;
		this.setState( function (prevState) {
			prevState.playlist[prevState.currentPrecache].time = this.DOM_audioHTMLElementPrecache.current.duration;
			prevState.playlist[prevState.currentPrecache].precached = true;
			
			if (prevState.currentPrecache<(prevState.playlist.length-1)) {
				prevState.currentPrecache++;
			}
			return prevState;
		}, function() {
			this.PlayListRef.current.setState( { 
				playlist : this.state.playlist 
			} , (function () {
				this.PlayListRef.current.updateListItemState(updateListItem);
			}).bind(this) );
		} );
	}
	updateStateTick() {
		this.setState( {
			volume 			: this.DOM_audioHTMLElement.current.volume*100,
			muted			: (this.DOM_audioHTMLElement.current.volume===0) ? true : false,
			currentTime 	: this.DOM_audioHTMLElement.current.currentTime,
			currentLenght 	: this.DOM_audioHTMLElement.current.duration,
			paused 			: this.DOM_audioHTMLElement.current.paused
		} );
	}
	isHTMLAudioInited() {
		return (this.DOM_audioHTMLElement.current);
	}
	isMuted() {
		return this.state.muted;
	}
	isPaused() {
		if (!this.DOM_audioHTMLElement.current) return true;
		return (this.DOM_audioHTMLElement.current.paused);
	}
	getCurrentTimePercent() {
		if (this.DOM_audioHTMLElement.current.duration) {
			return Math.round(this.DOM_audioHTMLElement.current.currentTime/this.DOM_audioHTMLElement.current.duration*100)
		}
		return 0;
	}
	getCurrentTime() {
		return this.DOM_audioHTMLElement.current.currentTime;
	}
	getCurrentVolumeLevel() {
		return this.DOM_audioHTMLElement.current.volume;
	}
	beginPlayNewTrack() {
		this.DOM_audioHTMLElement.current.src = this.state.playlist[this.state.currentTrack].source;
		this.DOM_audioHTMLElement.current.play();
	}
	onTrackEnd(e) {
		this.controlPlayNext();
	}
	controlPlayNext() {
		this.setState( {
			currentTrack : (this.state.currentTrack<(this.state.playlist.length-1)) ? (this.state.currentTrack+1) : 0
		}, function () {
			this.beginPlayNewTrack();
		} );
	}
	controlPlayPrev() {
		this.setState( {
			currentTrack : (this.state.currentTrack>0) ? (this.state.currentTrack-1) : (this.state.playlist.length-1)
		} , function () {
			this.beginPlayNewTrack();
		} );
	}
	controlPlayPause() {
		if (this.DOM_audioHTMLElement.current.paused) {
			this.DOM_audioHTMLElement.current.play();
			this.setState( { paused : false } );
		} else {
			this.DOM_audioHTMLElement.current.pause();
			this.setState( { paused : true } );
		}
	}
	controlMute() {
		
		if (this.state.muted) {
			this.ControlsRef.current.setCurrentVolumeLevelView(this.state.muted_lastVolume);
			this.DOM_audioHTMLElement.current.volume = this.state.muted_lastVolume/100;
		} else {
			this.setState( {
				muted_lastVolume : this.ControlsRef.current.getCurrentVolumeLevel()
			} );
			this.ControlsRef.current.setCurrentVolumeLevelView(0);
			this.DOM_audioHTMLElement.current.volume = 0;
		}
		this.setState( { muted : !this.state.muted} );
		
	}
	controlTimeSeek(percentOfAudioLenth) {
		if (this.DOM_audioHTMLElement.current.duration) {
			var time = this.DOM_audioHTMLElement.current.duration/100*percentOfAudioLenth;
			this.DOM_audioHTMLElement.current.currentTime = time;
			this.setState( { currentTime : time } );
			if (this.DOM_audioHTMLElement.current.paused) {
				this.setState( { paused : false } );
				this.DOM_audioHTMLElement.current.play();
			}
		}
	}
	controlVolumeLevel(percentOfVolumelevel) {
		this.DOM_audioHTMLElement.current.volume = percentOfVolumelevel/100;
		this.setState( {
			muted : false,
			volume : percentOfVolumelevel
		} );
	}
	
	render() {
		const precachedURL = (this.state.playlist.length) ? this.state.playlist[this.state.currentPrecache].source : null;
		const startURL = (this.state.playlist.length) ? this.state.playlist[this.state.currentTrack].source : null;
		return (
			<div className="audio-player">
				<audio ref={this.DOM_audioHTMLElementPrecache} 
					onLoadedMetadata={this.onPrecachedAudio}
					preload="metadata"
					src={precachedURL}></audio>
				<audio ref={this.DOM_audioHTMLElement} 
					preload="metadata" 
					onEnded={this.onTrackEnd}
					src={startURL}>
				</audio>
				<AudioPlayerControls root={this} ref={this.ControlsRef}/>
				<AudioPlayerPlayList root={this} ref={this.PlayListRef}/>
			</div>
		);
	}
}

export default AudioPlayer;