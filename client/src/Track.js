import React from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios'
import Playlists from './Playlists';

export default function Track({track, chooseTrack, handlePause, spotifyApi, user, accessToken}) {
    const [like, setLike] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [playlists, setPlaylists] = useState([]);
    
    function handleChange(isVisible) {
        if(isVisible) chooseTrack(track);
    }
    
    function handleClick() {
        handlePause();
    }

    function handleLike() {
        setLike(!true)
    }

    function handlePlaylist() {
        setShow(true);
        const headers = {
            Authorization: 'Bearer ' + accessToken,
        };
        axios.get("https://api.spotify.com/v1/me/playlists", {headers})
            .then(function(response) {
                setPlaylists(response.data.items.map(playlist => {
                    return {
                        name: playlist.name,
                        playlistImage: playlist.images[0].url,
                        playlistUri: playlist.uri
                    }
                }))
                
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    return (
        <div>
            <VisibilitySensor onChange={handleChange} scrollCheck={true} delayedCall={true} intervalCheck={true} resizeCheck={true}>
                <div className="song" style={{cursor: 'pointer'}} onClick={handleClick}>
                    <img src={track.albumUrl}></img>
                    <div className="videoFooter">
                        <div className="videoFooter__text">
                            <h3>{track.title}</h3>
                            <p>{track.artist}</p>
                        </div>
                        <img
                            className="videoFooter__record"
                            src="https://static.thenounproject.com/png/934821-200.png"
                            alt="Record"
                        />
                    </div>
                    <div className="videoSidebar">
                        <div className="videoSidebar__button">
                            <FavoriteIcon fontSize="large" onClick={handleLike} />
                        </div>
                        <div className="videoSidebar__button">
                            <PlaylistAddIcon fontSize="large" onClick={handlePlaylist}/>
                        </div>
                    </div>
                    <Modal show={show} onHide={handleClose} centered className="modal_wrapper">
                        <Modal.Header className="modal_header">
                            <Modal.Title>Add to Playlist</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                        {playlists.map(playlist => (
                            <Playlists playlist={playlist} key={playlist.uri}/>
                        ))}
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" className="modal_button" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={handleClose}>Save changes</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </VisibilitySensor>
        </div>
    )
}
