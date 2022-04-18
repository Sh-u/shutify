import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState} from 'recoil';
import { currentSongIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify'
import MySession from '../lib/MySession';

const Player = () => {

    const spotifyApi = useSpotify();
    const songInfo = useSongInfo();

    const [currentSongId, setCurrentSongId] = useRecoilState<string>(currentSongIdState)
    const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState);
    const [volume, setVolume] = useState<number>(50);


    const { data: _data, status } = useSession();
    const session = _data as MySession;

    const handlePlayPause = () => {
      spotifyApi.player.getPlaybackInfo().then((data) => {
        if (data.is_playing){
          spotifyApi.player.pause();
          setIsPlaying(false);
        }
        else {
          spotifyApi.player.play();
          setIsPlaying(true);
        }
      })
    }

    const handleNextSong = () => {
      
      spotifyApi.player.skipToNext().catch((err) => console.log('skip song ', err));

    }

    const handlePrevSong = () => {
      
      spotifyApi.player.skipToPrevious().catch((err) => console.log('skip song ', err));

    }




    let imageUrl: string | undefined = songInfo?.album?.images?.[0]?.url;

    const fetchCurrentSong = () => {
      if (!songInfo){
        spotifyApi.player.getCurrentlyPlayingTrack().then((data) => {

          if (typeof data === 'string'){
            console.log('current song id error')
            return;
          }       

          console.log("now playing", data.item);
          if (data.item !== null){
            setCurrentSongId(data.item.id);
   
          }

          spotifyApi.player.getPlaybackInfo().then((data) => {
            setIsPlaying(data.is_playing);
          })
        })
      }
    }

    useEffect(() => {
      if (volume > 0 && volume < 100){
        AdjustVolume(volume);
      }
    }, [volume])


    const AdjustVolume = useCallback(
      debounce((volume) => {spotifyApi.player.setVolume(volume).catch((err) => {console.log(err)})}, 200)
      ,[]);

    useEffect(() => {

      if (spotifyApi.getAccessToken() && !currentSongId){
        fetchCurrentSong();
        setVolume(50);
      }

    }, [currentSongId, spotifyApi, session])

  return (
    <div className='absolute bottom-0 w-full bg-gradient-to-b from-black to-gray-800 grid grid-cols-3 text-xs md:text-base px-2 md:px-10'>
        
      <div className='flex items-center justify-start  space-x-2 md:space-x-5'>
            {
              imageUrl ? <img src={imageUrl} className="hidden md:inline w-20 h-20 p-2"/> : <div/>
            }
        
        <div className='flex items-center flex-col text-white'>
          <h3 className='text-sm md:text-2xl'>{songInfo?.name}</h3>
          <p className='text-gray-300'>{songInfo?.artists?.[0].name }</p>
        </div>
      </div>

      <div className='flex items-center justify-center space-x-2 md:space-x-5'>
        <SwitchHorizontalIcon className='button'/>
        <RewindIcon className='button' onClick={handlePrevSong}/>
        {isPlaying ? <PauseIcon onClick={handlePlayPause} className='button w-10 h-10'/> : <PlayIcon onClick={handlePlayPause} className='button w-10 h-10' />}
        <FastForwardIcon className='button' onClick={handleNextSong}/>
        <ReplyIcon className="button"/>
      </div>

      <div className='flex items-center justify-end space-x-2 md:space-x-5 '>
        <VolumeOffIcon className='button' onClick={() => { volume > 0 && setVolume(volume-10)}}/>
        <input className='w-14 md:w-28' type='range' value={volume} min={0} max={100} onChange={e => setVolume(Number(e.target.value))}/>
        <VolumeUpIcon className='button'onClick={() => { volume < 100 && setVolume(volume+  10)}}/>
      </div>

    </div>
  )
}

export default Player
