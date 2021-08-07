import React from 'react'
import useAuth from './useAuth'
import "./styles.css";
import { useEffect, useState, useRef } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import Track from './Track'
import Player from './Player'
import VisibilitySensor from 'react-visibility-sensor'

const spotifyApi = new SpotifyWebApi({
    clientId: "04b58f88acc4424e80307138133fd4e3",
})

export default function TikTok({code}) {
    const accessToken = useAuth(code)
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [paused, setPaused] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const songRef = useRef();


    function chooseTrack(track) {
        if (!loading) setPlayingTrack(track)
    }

    function handlePause() {
        setPaused(!paused)
    }
    
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)        
    }, [accessToken])

    useEffect(() => {
       fetchMoreData(0);
       setLoading(false);
       spotifyApi.getMe()
        .then(function(data) {
            setUser(data.body.display_name);
        }, function(err) {
            console.log('Something went wrong!', err)
        })
    }, [accessToken]);

    function handlePlayerVisible() {
        setRefresh(currRefresh => currRefresh + 1);
        console.log(refresh)
        setLoading(true) 
        fetchMoreData(refresh);
    }

    const fetchMoreData = (refresh) => {
        if(!accessToken) return
        spotifyApi.getMyTopTracks()
        .then(function(data) {
            const songIDs = data.body.items.map(track => {
                return {
                    songID: track.id
                } 
            })
            console.log(songIDs)
            return songIDs;
        }, function(err) {
            console.log('Something went wrong!', err);
        })
        .then(function(songIDs) {
            let ids = [];
            ids.push(songIDs[refresh].songID);
            console.log(ids);
            return spotifyApi.getRecommendations({seed_tracks: ids})
        })
        .then(function(data) {
            const songData = data.body.tracks.map(track => {
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: track.album.images[0].url
                }
            })
            console.log(songData);
            setSearchResults(searchResults.concat(songData));
            setTimeout(() => {
                setLoading(false);
              }, 3000);
        }, function(err) {
            console.log('Something went wrong!', err)
        });
    };


    return (
        <div>
            <div className="App">
                <h1>Welcome to Explore Spotify!</h1>
            </div>
            <section id="scrollableDiv" className="container" ref={songRef}>
            {searchResults.map(track => (
                <Track track={track} key={track.uri} chooseTrack={chooseTrack} handlePause={handlePause} spotifyApi={spotifyApi} user={user} accessToken={accessToken}/>
            ))}
            <VisibilitySensor onChange={handlePlayerVisible} delayedCall={true} scrollCheck={true} intervalCheck={true} resizeCheck={true} resizeDelay={250}>
                <div><Player accessToken={accessToken} trackUri={playingTrack?.uri} paused={paused}/></div>
            </VisibilitySensor>
            </section>
            <div className="App">
                <h1>This is a footer</h1>
            </div>
        </div>
    )
}
