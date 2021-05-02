import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Image from 'next/image';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ progress, setProgress ] = useState(0);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasPreviousEpisode,
    hasNextEpisode,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerSate } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    isPlaying ? 
    audioRef.current.play() :
    audioRef.current.pause();
  }, [ isPlaying ]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      const formatedTime = Math.floor(audioRef.current.currentTime);
      setProgress(formatedTime);
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    hasNextEpisode ? 
    playNext() : 
    clearPlayerSate();
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={592} 
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progressBar}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ background: '#9f75ff'}}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
              ) : (
              <div className={styles.emptySlider}/>
              )
            }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            loop={isLooping}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={ isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button 
            type="button" 
            disabled={!episode || !hasPreviousEpisode}
          >
            <img 
              src="/play-previous.svg" 
              alt="Tocar anterior"
              onClick={playPrevious}
            />
          </button>
          <button 
            type="button" 
            className={styles.playButton} 
            disabled={!episode || !hasNextEpisode}
            onClick={togglePlay}
          >
            { isPlaying ?
             <img src="/pause.svg" alt="Pausar"/>:
             <img src="/play.svg" alt="Tocar"/>
            }
          </button>
          <button type="button" disabled={!episode}>
            <img 
              src="/play-next.svg" 
              alt="Tocar próxima" 
              onClick={playNext} 
            />
          </button>
          <button 
            type="button" 
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Player;
