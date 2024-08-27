import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PokemonListController from '../Controller/PokemonListController';

class PokemonListView extends Component {
  render() {
    return (
      <PokemonListController>
        {({ pokemonData, loading, error, fetchMore }) => (
          <div>
            <h1>Pokémon List</h1>
            {error && <p>{error}</p>}
            {pokemonData.map((pokemon, index) => (
              <p key={index}>
                <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
              </p>
            ))}
            {loading && <p>Loading...</p>}
          </div>
        )}
      </PokemonListController>
    );
  }
}

export default PokemonListView;
