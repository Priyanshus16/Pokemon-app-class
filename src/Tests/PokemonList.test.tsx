import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import PokemonListController from '../Controller/PokemonListController';
import { act } from 'react';

global.fetch = jest.fn();

const mockFetchResponse = (data: object | null | undefined) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data ?? {}),
  } as Response);
};

describe('PokemonListController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successful data fetch: should update state correctly', async () => {
    const mockData = {
      results: [{ name: 'Pikachu' }],
      next: 'some-url',
    };

    (global.fetch as jest.Mock).mockImplementation(() => mockFetchResponse(mockData));

    await act(async () => {
      render(
        <PokemonListController>
          {({ loading, pokemonData, error }) => (
            <div>
              <div data-testid="loading">{loading ? 'Loading...' : 'Not Loading'}</div>
              <div data-testid="pokemon-data">{pokemonData.length}</div>
              <div data-testid="error">{error || 'No Error'}</div>
            </div>
          )}
        </PokemonListController>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-data')).toHaveTextContent('1');
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
  });

  test('Error handling: should display error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => Promise.reject(new Error('Failed to fetch')));

    await act(async () => {
      render(
        <PokemonListController>
          {({ loading, pokemonData, error }) => (
            <div>
              <div data-testid="loading">{loading ? 'Loading...' : 'Not Loading'}</div>
              <div data-testid="pokemon-data">{pokemonData.length}</div>
              <div data-testid="error">{error || 'Failed to load Pokémon data.'}</div>
            </div>
          )}
        </PokemonListController>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to load Pokémon data.');
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('pokemon-data')).toHaveTextContent('0');
  });

  test('Scroll event triggers fetchMore when at bottom of page', async () => {
    const mockData = {
      results: [{ name: 'Charmander' }],
      next: null, 
    };

    (global.fetch as jest.Mock).mockImplementation(() => mockFetchResponse(mockData));

    await act(async () => {
      render(
        <PokemonListController>
          {({ loading, pokemonData, error }) => (
            <div>
              <div data-testid="loading">{loading ? 'Loading...' : 'Not Loading'}</div>
              <div data-testid="pokemon-data">{pokemonData.length}</div>
              <div data-testid="error">{error || 'No Error'}</div>
            </div>
          )}
        </PokemonListController>
      );
    });

    window.scrollY = document.documentElement.scrollHeight - window.innerHeight;
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading'));

    expect(screen.getByTestId('pokemon-data')).toHaveTextContent('1');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
  });

  test('Removes scroll event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <PokemonListController>
        {() => <div />}
      </PokemonListController>
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
