import { DefaultSession} from 'next-auth';




type MySession = DefaultSession  & {
    user: {
      accessToken: string;
      refreshToken: string;
      username: string;
    }
  }


  export default MySession;