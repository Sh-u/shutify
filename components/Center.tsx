import { signOut, useSession } from 'next-auth/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import {playlistIdState,playlistState} from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
import MySession from '../lib/MySession';


 const Center = () => {

    const spotifyApi = useSpotify();
    const { data: _data, status } = useSession();
    const session = _data as MySession;
    
    const [color, setColor] = useState<string | null>(null);
    const playlistID = useRecoilValue<string>(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);

    
    const getRandomIndex = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

   
    const colors = [
      "from-indigo-500",
      "from-sky-500",
      "from-amber-500",
      "from-emerald-500",
      "from-rose-500",
      "from-pink-500",
      "from-green-500",
    ]

    useEffect(() => {
      
      let newColor = colors[getRandomIndex(0, colors.length)];
      while (color === newColor){
        newColor = colors[getRandomIndex(0, colors.length)];
      }

      setColor(newColor);
      
      
    }, [playlistID])
    

    useEffect(() => {
      spotifyApi.setAccessToken(session?.user?.accessToken)
      
      if (spotifyApi.getAccessToken() && status === 'authenticated'){
        spotifyApi.playlists.getPlaylist(playlistID).then((data) => {
          setPlaylist(data);
        }).catch((err) => { console.log('something went wrong with setting playlist' + err)})
      }
     
      if (playlist){
        console.log(playlist)
      }
    }, [session, playlistID])

    

    
  return (
    <div className='flex-grow overflow-y-scroll scrollbar-hide h-screen'>
        <header className='text-white absolute top-5 right-5 '>
        <div className='flex items-center space-x-2 bg-black opacity-90 hover:bg-opacity-60  cursor-pointer p-1  rounded-full' onClick={() => signOut()}>
            <img className='rounded-full w-10 h-10' src={session?.user?.image!} alt=""></img>
            <h2 className='font-bold'>{session?.user?.name}</h2>
            <ChevronDownIcon className='text-white h-10 w-10'/>
        </div>
        </header>
        

        <section className={`flex items-end space-x-8 bg-gradient-to-b ${color} h-80 p-8`}>
          
            
            <img src={playlist?.images?.[0]?.url} alt='' className='h-44 w-44 shadow-2xl'></img>
            <div>
              <p className='text-white text-xl'>Playlist</p>
              <h1 className='text-white text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name} </h1>
              </div>
        </section>

        <div className=''>
          <Songs/>
        </div>
    </div>
  )
}

export default Center;
