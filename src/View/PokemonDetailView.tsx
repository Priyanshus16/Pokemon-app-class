import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import PokemonDetailController from '../Controller/PokemonDetailController';

interface PokemonDetailViewProps {
  id: string;
}

class PokemonDetailView extends Component<PokemonDetailViewProps> {
  render() {
    const { id } = this.props;

    return (
      <PokemonDetailController id={id}>
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
  }
}

const withParams = (Component: React.ComponentType<PokemonDetailViewProps>) => {
  return (props: any) => {
    const { id } = useParams<{ id: string }>();
    return <Component {...props} id={id || ''} />;
  };
};

export default withParams(PokemonDetailView);
