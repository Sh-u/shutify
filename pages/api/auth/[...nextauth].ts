import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"
import MySession from "../../../lib/MySession"





const RefreshAccessToken = async (token) => {
      try {
        console.log('trying to refresh access token')
        spotifyApi.setAccessToken(token.accessToken)
        
        const resp  = await spotifyApi.getRefreshedAccessToken(token.refreshToken);
        console.log(`refreshed token is `)

          return {  
            ...token, 
            accessToken: resp.access_token,
            accessTokenExpires: Date.now() + resp.expires_in * 1000,
            refreshToken: token.refreshToken,
          }

      } catch (error) {
        console.error(error + ' refresh token error');

        return {
          ...token,
          error: 'Refresh access token error'
        }
      }
}


export default NextAuth({

  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || 'no client id',
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET || 'no client secret',
      authorization: LOGIN_URL,
    
    }),
 
  ],

  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {

    async jwt({token, account, user}){
      if (account && user){
        
        console.log('token is -> ',token)
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000,
        }
      }

      if (typeof token.accessTokenExpires === 'number'){
        if (Date.now() <  token.accessTokenExpires ){
        
          return token;
        }
      }
        
      

     

      return await RefreshAccessToken(token);
    },


  
 
    async session({session: _session, token}) {

        const session = _session as MySession;
        session.user.accessToken = token.accessToken as string; 
        session.user.refreshToken = token.refreshToken as string;
        session.user.username = token.username as string;
      
        return session;
    }

  }
})