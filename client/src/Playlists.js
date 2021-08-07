import React from 'react'

export default function Playlists({playlist}) {
    function handlePlaylistClick() {
        alert('Hello');
    }
    return (
        <div className="playlist_wrapper" onClick={handlePlaylistClick}>
            <img style={{ height: '60px', width: '60px'}} src={playlist.playlistImage}></img>
            <p style={{ color: "white" }}>{playlist.name}</p>
        </div>
    )
}
