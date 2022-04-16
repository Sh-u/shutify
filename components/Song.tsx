
import React, { useState } from 'react'
import {  useRecoilState } from 'recoil';
import { PlaylistItem, SimplifiedAlbum, SimplifiedArtist} from 'spotify-web-api-ts/types/types/SpotifyObjects';
import { currentSongIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify'
import millisToMinutesAndSeconds from '../lib/time';

import { FiPlay } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import MySession from '../lib/MySession';



const Song = ({item, order} : {item: PlaylistItem, order: number}) => {
    const spotifyApi = useSpotify();
   
    const { data: _data, status } = useSession();
    const session = _data as MySession;
    
    const [isHovered, setIsHovered] = useState(false);
    const [currentSongId, setCurrentSongId] = useRecoilState<string>(currentSongIdState);

    const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState);

    const playSong = () => {
      setCurrentSongId(item?.track?.id);
      setIsPlaying(true);

      spotifyApi.users.getMe()

      // console.log(spotifyApi.getAccessToken())
      spotifyApi.player.play({
        uris: [item?.track.uri]
      }).catch((err) => {console.log(err)})

    }
    
    let artists: Array<SimplifiedArtist> = [];
    let album!: SimplifiedAlbum;
    let imageUrl = '';
    if ('album' in item.track){
      imageUrl = item.track.album.images[0].url;
      album = item.track.album;
   }

   if ('artists' in item.track){
     for (let artist of item.track.artists){
      artists.push(artist);
     }
   }
  
  return (
    <div className='grid grid-cols-[4fr_1fr] md:grid-cols-3  text-white hover:bg-gray-900 rounded-lg' 
    onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      
        <div className='flex items-center space-x-4'>
             <p className={ isHovered ? 'cursor-pointer pl-2 w-4'  : 'pl-2' } onClick={playSong} >{isHovered ? <FiPlay className='hover:scale-125'/> : (order + 1)}</p>
             <img className='w-16 h-16 p-2' src={imageUrl} alt=''/>
             <div className='w-36 lg:w-56 truncate'>
                <em className=''>{item?.track.name}</em>
                {artists.map((a) => (
                  <p key={a.id} className='text-xs md:text-sm text-gray-400'>{a.name}</p>
                ))}
             </div>
        </div>
        <div className=' hidden md:flex  items-center'>
          <p className=' text-lg'>{album.name}</p>
          
        </div>
        <div className='flex items-center text-sm  md:ml-0'>
        <p>{millisToMinutesAndSeconds(item?.track.duration_ms)}</p>
        </div>
    </div>
  )
}

export default Song
