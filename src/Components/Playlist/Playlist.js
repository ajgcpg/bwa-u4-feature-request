import React from 'react'
import './Playlist.css'
import TrackList from "../TrackList/TrackList";

class Playlist extends React.Component{
    constructor(props){
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
    }

    handleNameChange(event){
        const newPlaylistName = event.target.value
        this.props.onNameChange(newPlaylistName)
    }

    render(){
        return(
            <div className="Playlist">
                <input defaultValue="My Playlist" onChange={this.handleNameChange}/>
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} swap={this.props.swap}/>
                <p>Drag songs to reorder</p>
                <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
            </div>
        )
    }
}

export default Playlist