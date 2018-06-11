import React from 'react'
import './Track.css'
import '../TrackList/TrackList.js'

class Track extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            id: this.props.track.id,
            title: this.props.track.name,
            artist: this.props.track.artist,
            album: this.props.track.album,
            target: false,
        }
        this.addTrack = this.addTrack.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
        this.dragStart = this.dragStart.bind(this)
        this.dragEnter = this.dragEnter.bind(this)
        this.dragExit = this.dragExit.bind(this)
        this.drop = this.drop.bind(this)
    }

    addTrack(){
        this.props.onAdd(this.props.track)
    }

    removeTrack(){
        this.props.onRemove(this.props.track)
    }

    renderAction(){
        if(this.props.isRemoval){
            return <p className="Track-action" onClick={this.removeTrack}>-</p>
        }
        else{
            return <p className="Track-action" onClick={this.addTrack}>+</p>
        }
    }

    dragStart(event){
        event.dataTransfer.setData("text", event.target.id)
    }

    dragEnter(event){
        if(this.props.isRemoval) {
            event.preventDefault()
            this.setState({
                target: true
            })
        }
    }

    dragExit(event){
        if(this.props.isRemoval) {
            event.preventDefault()
            this.setState({
                target: false
            })
        }
    }

    drop(event){
        this.setState({
            target: false
        })
        if(event.target.draggable === true){
            this.props.swap(event.dataTransfer.getData("text"), event.target.id)
        }
    }


    render(){
        if(!this.state.target) {
            return (
                <div id={this.state.id} className="Track" draggable={this.props.isRemoval ? true : false} onDragEnter={this.dragEnter}
                     onDragStart={this.dragStart} onDragLeave={this.dragExit} onDrop={this.drop} onDragEnd={this.dragEnd}>
                    <div className="Track-information">
                        <h3>{this.state.title}</h3>
                        <p>{this.state.artist} | {this.state.album}</p>
                    </div>
                    <a className="Track-action">{this.renderAction()}</a>
                </div>
            )
        }
        else{
            return(
                <div id={this.state.id} className="Track" draggable={this.props.isRemoval ? true : false} onDragOver={this.dragEnter}
                     onDragStart={this.dragStart} onDrop={this.props.isRemoval ? this.drop : this.removeTrack} onDragLeave={this.dragExit}>
                    <div className="Track-information" />
                </div>
            )
        }
    }
}

export default Track