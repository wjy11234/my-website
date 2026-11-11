import { lyrics, lyricsBeggingYou, lyricsJingyinLianren } from './lyrics'

// 歌曲列表
export const songs = [
  {
    title: '勿忘我',
    artist: '陶喆',
    src: '/taozhe-wuwangwo.mp3',
    lyrics: lyrics,
    lyricsIndex: 0,
  },
  {
    title: 'Begging You (Guide Ver.)',
    artist: '2Lson',
    src: '/2Lson - Begging You (Guide Ver.) (Bonus Track).mp3',
    lyrics: lyricsBeggingYou,
    lyricsIndex: 1,
  },
  {
    title: '静音恋人',
    artist: '礼越',
    src: '/liyue-jingyin-lianren.mp3',
    lyrics: lyricsJingyinLianren,
    lyricsIndex: 2,
  },
]
