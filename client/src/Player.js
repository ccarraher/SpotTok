import React from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
import {useState} from 'react'
import {useEffect} from 'react'

export default function Player({accessToken, trackUri, paused}) {
    const [play, setPlay] = useState(false)
    useEffect(() => setPlay(true), [trackUri])

    if (!accessToken) return null
    return <SpotifyPlayer
        token={accessToken}
        autoPlay={play}
        play={paused}
        callback={state=> {
            if (!state.isPlaying) setPlay(false)
        }}
        uris={trackUri ? [trackUri] : []}
    />

}
