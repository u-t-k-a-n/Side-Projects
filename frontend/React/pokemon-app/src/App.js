import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonList from "./PokemonList";
import Pagination from "./Pagination";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nextPageUrl, setNextPageUrl] = useState();
  const [previousPageUrl, setPreviousPageUrl] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios.get(currentPageUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    })
      .then(res => {
        setLoading(false);
        setPokemon(res.data.results.map(p => p.name));
        setNextPageUrl(res.data.next);
        setPreviousPageUrl(res.data.previous);
      });
    return () => cancel();
  }, [currentPageUrl])

  if (loading) {
    return <div>Loading...</div>;
  }

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function gotoPreviousPage() {
    setCurrentPageUrl(previousPageUrl);
  }

  return (
    <>
      <PokemonList pokemon={pokemon} />
      <Pagination 
        gotoNextPage={nextPageUrl ? gotoNextPage : null}
        gotoPreviousPage={previousPageUrl ? gotoPreviousPage : null}
      />
    </>
  );
}

export default App;
