import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PokemonDetailView from '../View/PokemonDetailView';

beforeEach(() => {
  jest.resetAllMocks();
});

test('API Call Test: Verify that the detail API is called with the correct Pokémon ID', async () => {
  const mockResponse = {
    name: 'pokemon-1',
    details: 'Details of pokemon-1',
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) } as Response)
  );

  render(
    <MemoryRouter initialEntries={['/pokemon/1']}>
      <Routes>
        <Route path="/pokemon/:id" element={<PokemonDetailView />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1');
  });
});

test('Error Handling Test: Simulate an error and ensure the error message is displayed', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    } as Response)
  );

  render(
    <MemoryRouter initialEntries={['/pokemon/999']}>
      <Routes>
        <Route path="/pokemon/:id" element={<PokemonDetailView />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Failed to load Pokémon details.')).toBeInTheDocument();
  });
});

test('Edge Case Test: Test how the app behaves when the Pokémon ID is invalid', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
    } as Response)
  );

  render(
    <MemoryRouter initialEntries={['/pokemon/invalid-id']}>
      <Routes>
        <Route path="/pokemon/:id" element={<PokemonDetailView />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Failed to load Pokémon details.')).toBeInTheDocument();
  });
});
