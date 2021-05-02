import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  playEpisodeList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  hasPreviousEpisode: boolean;
  hasNextEpisode: boolean;
  isLooping: boolean;
  toggleLoop: () => void;
  isShuffling: boolean;
  toggleShuffle: () => void;
  clearPlayerSate: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [ episodeList, setEpisodeList ] = useState([]);
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isLooping, setIsLooping ] = useState(false);
  const [ isShuffling, setIsShuffling ] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playEpisodeList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerSate() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPreviousEpisode = currentEpisodeIndex > 0;
  const hasNextEpisode = isShuffling || currentEpisodeIndex + 1 < episodeList.length;

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor((Math.random() * episodeList.length));
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNextEpisode) {
      const nextEpisodeIndex = currentEpisodeIndex + 1;
      setCurrentEpisodeIndex(nextEpisodeIndex);
    }
  }

  function playPrevious() {
    if (hasPreviousEpisode) {
      const previousEpisodeIndex = currentEpisodeIndex - 1;
      setCurrentEpisodeIndex(previousEpisodeIndex);
    }
  }

  return (
    <PlayerContext.Provider value={
      {
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setPlayingState,
        playEpisodeList,
        playNext,
        playPrevious,
        hasPreviousEpisode,
        hasNextEpisode,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerSate
      }
    }>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}