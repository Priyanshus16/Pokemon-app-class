import { Component } from 'react';

interface Pokemon {
  name: string;
}

interface PokemonResponse {
  results: Pokemon[];
  next: string | null;
}

interface PokemonListControllerProps {
  children: (state: {
    pokemonData: Pokemon[];
    loading: boolean;
    error: string | null;
    fetchMore: () => void;
  }) => JSX.Element;
}

interface PokemonListControllerState {
  pokemonData: Pokemon[];
  nextUrl: string | null;
  loading: boolean;
  error: string | null;
}

class PokemonListController extends Component<PokemonListControllerProps, PokemonListControllerState> {
  constructor(props: PokemonListControllerProps) {
    super(props);
    this.state = {
      pokemonData: [],
      nextUrl: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20',
      loading: false,
      error: null,
    };
  }

  async componentDidMount() {
    this.getPokemonData();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getPokemonData = async () => {
    const { nextUrl } = this.state;

    if (!nextUrl) return;

    this.setState({ loading: true });

    try {
      const response = await fetch(nextUrl);

      const data: PokemonResponse = await response.json();
      this.setState(prevState => ({
        pokemonData: [...prevState.pokemonData, ...data.results],
        nextUrl: data.next,
        loading: false,
      }));
    } catch (error) {
      this.setState({
        loading: false,
        error: 'Failed to load Pokémon data.',
      });
    }
  };

  handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
      !this.state.loading
    ) {
      this.getPokemonData();
    }
  };

  render() {
    return this.props.children({
      pokemonData: this.state.pokemonData,
      loading: this.state.loading,
      error: this.state.error,
      fetchMore: this.getPokemonData,
    });
  }
}

export default PokemonListController;

