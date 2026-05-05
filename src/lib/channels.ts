export interface Programme {
  title: string;
  startTime: string;
  endTime: string;
  isLive?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  category: "News" | "Movies" | "Sports";
  logo: string;
  streamUrl: string;
  isPremium?: boolean;
  nowPlaying: Programme;
  nextPlaying: Programme;
}

export const liveChannels: Channel[] = [
  {
    id: "cnn-hd",
    name: "CNN HD",
    category: "News",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cnn_breaking_news_movie.jpg/320px-Cnn_breaking_news_movie.jpg",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isPremium: false,
    nowPlaying: {
      title: "Breaking News Update",
      startTime: "20:00",
      endTime: "20:30",
    },
    nextPlaying: {
      title: "World News Tonight",
      startTime: "20:30",
      endTime: "21:00",
    },
  },
  {
    id: "bbc-news",
    name: "BBC News",
    category: "News",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/BBC_News.svg/320px-BBC_News.svg.png",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isPremium: false,
    nowPlaying: {
      title: "BBC News at Nine",
      startTime: "21:00",
      endTime: "21:30",
    },
    nextPlaying: {
      title: "Newsnight",
      startTime: "21:30",
      endTime: "22:00",
    },
  },
  {
    id: "sky-sports",
    name: "Sky Sports",
    category: "Sports",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sky_Sports_logo_%282020%29.svg/320px-Sky_Sports_logo_%282020%29.svg.png",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isPremium: false,
    nowPlaying: {
      title: "Premier League Football",
      startTime: "19:45",
      endTime: "21:45",
    },
    nextPlaying: {
      title: "Match Highlights",
      startTime: "21:45",
      endTime: "22:15",
    },
  },
  {
    id: "espn",
    name: "ESPN",
    category: "Sports",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/ESPN.svg/320px-ESPN.svg.png",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isPremium: true,
    nowPlaying: {
      title: "NBA Live",
      startTime: "20:00",
      endTime: "22:00",
    },
    nextPlaying: {
      title: "Sports Center",
      startTime: "22:00",
      endTime: "23:00",
    },
  },
  {
    id: "hbo-max",
    name: "HBO Max",
    category: "Movies",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/HBO_Max_logo.svg/320px-HBO_Max_logo.svg.png",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isPremium: true,
    nowPlaying: {
      title: "The Dark Knight",
      startTime: "18:30",
      endTime: "20:45",
    },
    nextPlaying: {
      title: "Inception",
      startTime: "20:45",
      endTime: "23:15",
    },
  },
  {
    id: "netflix-live",
    name: "Netflix Live",
    category: "Movies",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Netflix_logo.svg/320px-Netflix_logo.svg.png",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isPremium: true,
    nowPlaying: {
      title: "Interstellar",
      startTime: "19:00",
      endTime: "22:00",
    },
    nextPlaying: {
      title: "The Matrix",
      startTime: "22:00",
      endTime: "23:55",
    },
  },
  {
    id: "prime-video",
    name: "Prime Video",
    category: "Movies",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/320px-Amazon_Prime_Video_logo.svg.png",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isPremium: false,
    nowPlaying: {
      title: "Avatar",
      startTime: "17:45",
      endTime: "20:30",
    },
    nextPlaying: {
      title: "Dune",
      startTime: "20:30",
      endTime: "23:30",
    },
  },
  {
    id: "disney-plus",
    name: "Disney Plus",
    category: "Movies",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/320px-Disney%2B_logo.svg.png",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    isPremium: true,
    nowPlaying: {
      title: "Avengers Endgame",
      startTime: "18:00",
      endTime: "20:45",
    },
    nextPlaying: {
      title: "Black Panther",
      startTime: "20:45",
      endTime: "23:00",
    },
  },
];
