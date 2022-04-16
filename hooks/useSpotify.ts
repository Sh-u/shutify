import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react'

import { SpotifyWebApi } from 'spotify-web-api-ts';
import MySession from '../lib/MySession';


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    
});

 const useSpotify = () => {

    
    const { data: _data, status } = useSession();
    const session = _data as MySession;


    
   
      
    useEffect(() => {
        if (session){
            if (session.error === 'Refresh access token error'){
                signIn();
            }
        }
        spotifyApi.setAccessToken(session?.user?.accessToken)

        
        
    }, [session])

    return spotifyApi;
}

export default useSpotify