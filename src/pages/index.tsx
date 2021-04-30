import { useEffect } from "react"

export default function Home(props) {
  console.log(props.episodes);
  /* Fetching api data with SPA strategy */
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data))
  }, []);

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

/* Fetching api data with the SSR strategy */
export async function getServerSideProps() {
  /* This data is loaded everytime someone access the application */
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return { 
    props: {
      episodes: data,
    }
  }
}

/* Fetching api data with the SSR(Server-Side Rendering) strategy 
- Só funciona em produção!
export async function getServerSideProps() {
  This data is loaded everytime someone access the application 
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return { 
    props: {
      episodes: data,
    }
  },
  // Propriedade que torna essa requisição SSG(Static Site Generation)
  revalidate: 60 * 60 * 8, // 60 segundos * 60 minutos * 8, a cada 8 horas os dados serão atualizados
}
*/