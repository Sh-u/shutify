import { atom } from "recoil";


export const currentSongIdState = atom<string>({
    key: 'currentSongIdState',
    default: ''
})

export const isPlayingState = atom({
    key: 'isPlayingState',
    default: false,
})