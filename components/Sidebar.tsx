import React, { useEffect, useState } from 'react'

import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  HeartIcon,
  LogoutIcon

} from "@heroicons/react/solid";
import { useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify'
import { SimplifiedPlaylist } from 'spotify-web-api-ts/types/types/SpotifyObjects';
import { useRecoilState } from 'recoil';
import {playlistIdState} from '../atoms/playlistAtom';


const Sidebar = () => {

  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>([]);
  const [playlistsID, setPlaylistsID] = useRecoilState<string>(playlistIdState);


  useEffect(() => {
    if (spotifyApi.getAccessToken()){
      
      spotifyApi.playlists.getMyPlaylists().then((data) => {
        setPlaylists(data.items);
      })
      
    }
    

  }, [spotifyApi])
 
  

  
  return (
    <div className='text-gray-500  p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36' >
      <div className='space-y-2'>
        <button className="flex items-center space-x-2 hover:text-white"> 
          <HomeIcon className="h-5 w-5"/>
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5"/>
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5"/>
          <p>Library</p>
        </button>

        <hr className='border-gray-800 border-t-2' />

        <button className="flex items-center space-x-2 hover:text-white"> 
          <PlusCircleIcon className="h-5 w-5"/>
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5"/>
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5"/>
          <p>Your Episodes</p>
        </button>

        <hr className='border-gray-800 border-t-2' />

        {playlists.map((playlist) => (
          <p key={playlist.id} onClick={ () => { setPlaylistsID(playlist.id)}} className='hover:text-white cursor-pointer'>{playlist.name}</p>
        ))}

        
        
        </div>



    </div>
  )
}

export default Sidebar
