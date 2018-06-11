import React, { Component } from 'react';
import './App.css';
import '../SearchBar/SearchBar.js'
import SearchBar from "../SearchBar/SearchBar.js";
import SearchResults from "../SearchResults/SearchResults.js";
import Playlist from "../Playlist/Playlist.js";
import Spotify from "../../util/Spotify.js"

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchResults: [],
            playlistName: 'My Playlist',
            playlistTracks: []
        }
        this.addTrack = this.addTrack.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
        this.swapTrack = this.swapTrack.bind(this)
        this.updatePlaylistName = this.updatePlaylistName.bind(this)
        this.savePlaylist = this.savePlaylist.bind(this)
        this.search = this.search.bind(this)
    }

    addTrack(track){
        if(this.state.playlistTracks.find(savedTrack => track.id === savedTrack.id)){
            return;
        }
        const tracks = this.state.playlistTracks
        tracks.push(track)
        this.setState({playlistTracks: tracks})
    }

    removeTrack(track){
        this.setState({
            playlistTracks: this.state.playlistTracks.filter(removedTrack => {
                return removedTrack.id !== track.id
            })
        })
    }

    swapTrack(first, second){
        let firstTrack = null
        let secondTrack = null
        let tracks = this.state.playlistTracks
        tracks.forEach(function(currTrack, index){
            if(first === currTrack.id){
                firstTrack = [currTrack, index]
            }
            if(second === currTrack.id){
                secondTrack = [currTrack, index]
            }
        })
        tracks.splice(firstTrack[1], 1)
        tracks.splice(secondTrack[1], 0, firstTrack[0])
        this.setState({
            playlistTracks: tracks
        })

    }

    updatePlaylistName(name){
        this.setState({
            playlistName: name
        })
    }

    savePlaylist(){
        const tracks = this.state.playlistTracks
        const trackURIs = tracks.map(track => track.uri)
        console.log("uris: " + trackURIs)
        Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
            this.setState({playlistName: 'My Playlist', playlistTracks: [] })
        })
    }

    search(searchTerm){
        Spotify.search(searchTerm).then(tracks => {
            this.setState({
                searchResults: tracks
            })
        })
    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={this.search}/>
                    <div className="App-playlist">
                        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
                        <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} swap={this.swapTrack}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
