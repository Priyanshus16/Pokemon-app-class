import { Component, ReactNode } from 'react';

interface PokemonDetailData {
  name: string;
  ability: string; 
}

interface PokemonDetailControllerProps {
  id: string;
  children: (state: PokemonDetailControllerState) => ReactNode; 
}

interface PokemonDetailControllerState {
  pokemonDetail: PokemonDetailData | null;
  loading: boolean;
  error: string | null;
}

class PokemonDetailController extends Component<PokemonDetailControllerProps, PokemonDetailControllerState> {
  constructor(props: PokemonDetailControllerProps) {
    super(props);
    this.state = {
      pokemonDetail: null,
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    const { id } = this.props;

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) {
        throw new Error('Failed to load Pokémon details.');
      }
      const data = await response.json();
      console.log(data)
      this.setState({
        pokemonDetail: {
          name: data.name,
          ability: data.abilities[0].ability.name 
        },
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: 'Failed to load Pokémon details.',
        loading: false,
      });
    }
  }

  render() {
    return this.props.children(this.state);
  }
}

export default PokemonDetailController;
