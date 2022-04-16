import React from 'react'
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import Song from './Song';
import {
  ClockIcon,
} from "@heroicons/react/outline";


 const Songs = () => {

  const playlist = useRecoilValue(playlistState);

  return (
    <div>
      
      <div className=' grid grid-cols-[4fr_1fr] md:grid-cols-3 p-8 text-gray-300 '>
          <div className='hover:text-white w-5'>TITLE</div>
          <div className='hover:text-white w-5 hidden md:inline'>ALBUM</div> 
          <div className='hover:text-white w-5  md:ml-0 flex justify-center' ><ClockIcon/></div> 
      </div>
      
      <hr className='ml-8 mr-8 border-gray-800'/>

      <div className='flex flex-col space-y-7 text-white text-xl p-8'>
        {playlist?.tracks?.items.map((track, i) => (      
          <Song key={track?.track?.id} item={track} order={i}/>
         ))}
      </div>

    </div>  
  )
}

export default Songs;