// PokemonListView.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import PokemonListController from '../Controller/PokemonListController';

const PokemonListView: React.FC = () => {
  return (
    <PokemonListController>
      {({ pokemonData, loading, error, fetchMore }) => (
        <div>
          <h1>Pokémon List</h1>
          {error && <p>{error}</p>}
          <p>
            {pokemonData.map((pokemon, index) => (
              <p key={index}>
                <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
              </p>
            ))}
          </p>
          {loading && <p>Loading...</p>}
        </div>
      )}
    </PokemonListController>
  );
};

export default PokemonListView;
