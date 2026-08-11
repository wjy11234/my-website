// 占位图片资源，方便后续替换素材

// 本地图片导入
import article2Img from '../assets/article-2.jpg'

export const PLACEHOLDER = {
  // 头像 - 替换为真实头像URL
  avatar: '/IMG_6439.JPG',
  // 专辑封面 - 替换为歌曲封面URL
  albumCover: '/track-26128096.jpg',
  // 小猫立绘 - 替换为像素猫图片
  mascot: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pixel+art+cute+cat+character+for+game+standing+pose+transparent+background&image_size=square',
  // 文章封面占位图
  articleCover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coding+and+algorithm+visual+abstract+dark+theme+card+cover&image_size=landscape_16_9',
}

// 文章数据
export const articles = [
  {
    image: '/wallheaven-6.png',
    tag: 'idea',
    date: '2026-07-30',
    title: '想',
    desc: '突然有了想写一个网页的想法',
  },
  {
    image: article2Img,
    tag: '摄影',
    date: '2026-08-01',
    title: '动漫里的云朵｜棉花糖',
    desc: '说不上来的爽感。。。。。',
  },
  {
    image: '/IMG_6553.jpg',
    tag: 'AI',
    date: '2026-08-04',
    title: '感受',
    desc: 'scenes-gathered-zine-v1-3',
  },
]

// 说说数据
export const shuoshuo = [
  {
    id: 1,
    date: '2026-08-01',
    time: '12:00',
    content: '拍到了一朵超像棉花糖的云，动漫里的场景真的存在！☁️',
    tag: '日常',
  },
  {
    id: 2,
    date: '2026-08-02',
    time: '18:15',
    content: '这天干啥了来着，忘了',
    tag: '日常',
  },
  {
    id: 3,
    date: '2026-08-03',
    time: '12:00',
    content: '首页写完了，这东西很麻烦呀。',
    tag: '目标',
  },
  {
    id: 4,
    date: '2026-08-04',
    time: '23:59',
    content: '这个云服务器,我chovy',
    tag: '深夜',
  },
  {
    id: 5,
    date: '2026-08-05',
    time: '14:20',
    content: '碎碎念页面完成啦,下一个李白就是我。',
    tag: '日常',
  },
  {
    id: 6,
    date: '2026-08-06',
    time: '13:20',
    content: '工具很吊，我用我用。',
    tag: '工具',
  },
  {
    id: 6,
    date: '2026-08-11',
    time: '22:00',
    content: '难受,靠',
    tag: '日常',
  },
]

// 相册数据
export const albums = [
  {
    id: 1,
    name: '城市',
    date: '2026-04-05',
    desc: '初来乍到',
    cover: '/IMG_3671.JPG',
    photos: [
      '/IMG_3671.JPG',
      '/IMG_3741.JPG',
      '/IMG_3642.JPG',
      '/805.JPG',
      '/IMG_5839.JPG',
    ],
  },
  {
    id: 2,
    name: '街角日常',
    date: '2026-05-29',
    desc: '随拍',
    cover: '/IMG_6551.jpg',
    photos: [
      '/IMG_6551.jpg',
      '/IMG_4971.JPG',
    ],
  },
  {
    id: 3,
    name: '小糖豆专属',
    date: '2025-10-01',
    desc: '本人未授权,不予更新',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=late+night+kitchen+cozy+warm+lighting+food+cooking+polaroid+photo&image_size=square',
    photos: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=homemade+ramen+bowl+with+soft+boiled+egg+steaming+hot+top+view&image_size=landscape_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=freshly+baked+bread+on+wooden+cutting+board+warm+kitchen+light&image_size=landscape_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sizzling+steak+in+cast+iron+pan+with+herbs+and+butter+cozy&image_size=landscape_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dessert+plating+chocolate+cake+with+berries+late+night+baking&image_size=landscape_4_3',
    ],
  },
]

// 公告数据
export const announcement = {
  title: '网站施工中',
  subtitle: '页面内容持续更新，欢迎常回来看看。如有建议，欢迎通过邮箱或微信联系我。',
  items: [
    '更新了留言板',
    '天气无法获取位置是因为公网IP被浏览器拦截',
    '不要攻击我的网站',
  ],
}

// 歌词数据（时间单位：秒）
export const lyrics = [
  { time: 0, text: '前奏🎧' },
  { time: 20.74, text: '谢谢你曾陪我走过的路' },
  { time: 24.8, text: '今天只剩你一个人走' },
  { time: 30.2, text: '再好的故事终究要结束' },
  { time: 34.75, text: '我知道yeah' },
  { time: 39.94, text: '在我心中的你永远停在那天' },
  { time: 44.62, text: '倔强地微笑着的侧脸' },
  { time: 49.63, text: '忍住眼泪的你说不出的再见' },
  { time: 54.78, text: '却听见你轻轻地唱着' },
  { time: 59.18, text: 'Yo De Lay Lay Yo' },
  { time: 64.1, text: '请不要忘了我' },
  { time: 69.59, text: 'Yo De Lay Lay Yo' },
  { time: 74.03, text: '你不要忘了我答应我' },
  { time: 100.59, text: '谢谢你从不计较的付出' },
  { time: 104.76, text: '那是多么单纯的幸福' },
  { time: 110.02, text: '遗憾的是幸福不能弥补' },
  { time: 114.8, text: '最初的错误yeah' },
  { time: 119.76, text: '在你心中的我你要怎么记住' },
  { time: 124.59, text: '那些不再纪念的日子' },
  { time: 129.22, text: '你还是挥挥手装作毫不在乎' },
  { time: 134.72, text: '却低着头轻轻地唱着' },
  { time: 139.34, text: 'Yo De Lay Lay Yo' },
  { time: 144.31, text: '请不要忘了我' },
  { time: 148.74, text: 'Yo De Lay Lay Yo' },
  { time: 154.12, text: '你不要忘了我 yeah' },
  { time: 160.16, text: '记得那时候牵着你的手什么都没说' },
  { time: 164.18, text: '多笨拙yeah' },
  { time: 170.17, text: '如果还能够只想对你说永远记得我' },
  { time: 174.31, text: '记得我I say yeah' },
  { time: 182.03, text: 'I say Lay Lay Yo' },
  { time: 186.65, text: '请不要忘了我' },
  { time: 191.83, text: 'I say Lay Lay Yo' },
  { time: 196.55, text: '请你不要忘了我请你不要忘了我' },
  { time: 201.4, text: 'Yo De Lay Lay Yo' },
  { time: 206.7, text: 'Yo De Lay Lay Yo' },
  { time: 211.63, text: '你不要忘了我' },
  { time: 212.32, text: 'Yo De Lay Lay Yo' },
  { time: 216.94, text: '你不要忘了我' },
  { time: 237, text: '勿忘我' },
  { time: 241.6, text: 'Yo De Lay Lay Lay' },
]

// Begging You 歌词
export const lyricsBeggingYou = [
  { time: 0, text: '前奏🎧' },
  { time: 49.05, text: 'Came to my life so suddenly' },
  { time: 53.13, text: 'And now you\'re leaving me' },
  { time: 56.68, text: 'I\'m begging you' },
  { time: 60.59, text: 'never and never consider this' },
  { time: 64.21, text: 'There is no tomorrow' },
  { time: 67.15, text: 'You know time is our enemy' },
  { time: 70.45, text: 'So be true' },
  { time: 72.57, text: 'And I\'ll be with you' },
  { time: 74.43, text: 'And I will love you' },
  { time: 79.05, text: 'Don\'t tell me you have to leave' },
  { time: 86.05, text: 'You know we\'ll fall apart' },
  { time: 88.96, text: 'as soon as you leave yeah' },
  { time: 93.17, text: 'Don\'t tell me that you love me' },
  { time: 96.13, text: 'To get out' },
  { time: 97.92, text: 'To get away now' },
  { time: 100.02, text: 'There\'s no going back to' },
  { time: 101.48, text: 'I\'m not gonna let you' },
  { time: 103.26, text: 'I\'m won\'t let you go' },
  { time: 106.33, text: 'I love you' },
  { time: 109.86, text: 'I need you' },
  { time: 114.14, text: 'Isn\'t that just good enough for you' },
  { time: 117.52, text: 'Together' },
  { time: 119.32, text: 'We\'re together' },
  { time: 121.45, text: 'If you walk out on me now' },
  { time: 124.88, text: 'I won\'t be with you' },
  { time: 129.68, text: 'Came to my life so suddenly' },
  { time: 133.67, text: 'And now you\'re leaving me' },
  { time: 136.91, text: 'I\'m begging you' },
  { time: 140.74, text: 'never and never consider this' },
  { time: 144.4, text: 'There is no tomorrow' },
  { time: 147.43, text: 'You know time is our enemy' },
  { time: 150.81, text: 'So be true' },
  { time: 153.02, text: 'And I\'ll be with you' },
  { time: 154.75, text: 'And I will love you' },
  { time: 159.05, text: 'Things all just got crazy' },
  { time: 162.25, text: 'Living in uncertainty' },
  { time: 166.06, text: 'I\'ve been so weary of' },
  { time: 169.13, text: 'losing time with you' },
  { time: 175.92, text: 'Came to my life so suddenly' },
  { time: 179.87, text: 'And now you\'re leaving me' },
  { time: 183.33, text: 'I\'m begging you' },
  { time: 187.35, text: 'never and never consider this' },
  { time: 190.81, text: 'There is no tomorrow' },
  { time: 193.73, text: 'You know time is our enemy' },
  { time: 197.25, text: 'So be true' },
  { time: 199.2, text: 'And I\'ll be with you' },
  { time: 201.23, text: 'And I will love you' },
]

// 歌曲列表
export const songs = [
  {
    title: '勿忘我',
    artist: '陶喆',
    src: '/陶喆 - 勿忘我.mp3',
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
]
