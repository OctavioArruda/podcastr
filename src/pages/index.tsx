import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number,
  durationAsString: string;
  url: string;
}

type HomeProps = {
  // Array de Generic(tipo que pode ser uma função, receber parâmetros)
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  /* Fetching api data with SPA strategy */
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, []);

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcaster</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>
                    {episode.members}
                  </td>
                  <td style={{ width: 100 }}>
                    {episode.publishedAt}
                  </td>
                  <td>
                    {episode.durationAsString}
                  </td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

/* Fetching api data with the SSR strategy */
// export const getServerSideProps: GetStaticProps = async () => {
//   /* This data is loaded everytime someone access the application */
//   const response = await fetch('http://localhost:3333/episodes');
//   const data = await response.json();

//   return { 
//     props: {
//       episodes: data,
//     }
//   }
// }

/* Fetching api data with the SSR(Server-Side Rendering) strategy */
// - Só funciona em produção!
export const getServerSideProps: GetStaticProps = async () => {
  // This data is loaded everytime someone access the application
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map((episode): Episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      duration: Number(episode.file.duration),
      url: episode.file.url
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return { 
    props: {
      latestEpisodes: latestEpisodes,
      allEpisodes: allEpisodes,
      // Propriedade que torna essa requisição SSG(Static Site Generation)
      revalidate: 60 * 60 * 8, // 8 horas
    },
  }
}
