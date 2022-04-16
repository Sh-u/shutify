import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { Track } from 'spotify-web-api-ts/types/types/SpotifyObjects';
import { currentSongIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from './useSpotify'


const useSongInfo = () => {

    const spotifyApi = useSpotify();
    const currentSongId = useRecoilValue(currentSongIdState)
    const isPlaying = useRecoilValue(isPlayingState);

    const [songInfo, setSongInfo] = useState<Track  | null>(null);

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentSongId){
                const trackInfo = spotifyApi.tracks.getTrack(currentSongId).then((track) => {
                    setSongInfo(track);
                })
                

            }
        }
        

        fetchSongInfo();
        
    }, [currentSongId, spotifyApi])
  return songInfo;
}

export default useSongInfo
