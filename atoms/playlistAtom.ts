import { atom } from 'recoil'
import { Playlist} from 'spotify-web-api-ts/types/types/SpotifyObjects'
export const playlistState = atom<Playlist | null> ({
    key: 'playlistState',
    default: null
})

export const playlistIdState = atom({
    key: 'playlistIdState',
    default: '50IajozNAKgR3M8eFSdGa3'
})


 