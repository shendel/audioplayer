import React from 'react';
import ReactDOM from 'react-dom';
import AudioPlayer from './components/AudioPlayer';

const PlayerRef = React.createRef();
ReactDOM.render(<AudioPlayer ref={PlayerRef}/>, document.getElementById('player-root'));

PlayerRef.current.addTrack("AkA","Metal in my Body","https://sampleswap.org/mp3/artist/35449/AkA_Metal-in-my-Body-160.mp3")
PlayerRef.current.addTrack("Attic Base","Night Vision","https://sampleswap.org/mp3/artist/51138/Attic-Base_Night-Vision-160.mp3");
PlayerRef.current.addTrack("Attic Base","Sky","https://sampleswap.org/mp3/artist/51138/Attic-Base_Sky-160.mp3");
PlayerRef.current.addTrack("Attic Base","Martini Dreams","https://sampleswap.org/mp3/artist/51138/Attic-Base_Martini-Dreams-160.mp3");

