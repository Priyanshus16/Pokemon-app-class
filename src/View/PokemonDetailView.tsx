import React from 'react';
import { useParams } from 'react-router-dom';
import PokemonDetailController from '../Controller/PokemonDetailController';

const PokemonDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <PokemonDetailController id={id || ''}>
      {({ pokemonDetail, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>{error}</p>;

        return (
          <>
            <h1>Pokemon Details</h1>
            <pre>{JSON.stringify(pokemonDetail, null, 2)}</pre>
            </>
        );
      }}
    </PokemonDetailController>
  );
};

export default PokemonDetailView;
