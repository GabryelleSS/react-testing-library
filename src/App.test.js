import React from 'react'

import { render, screen, fireEvent, waitFor, findByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { renderWithProviders } from './test-utils';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { testUseAppSelector } from './test-app-selector';

import App from './App';

jest.mock("./redux-hooks");

const mockObject = [
  { name: 'Projeto 1', id: 1, private: false, description: 'Teste 1' },
  { name: 'Projeto 2', id: 2, private: false, description: 'Teste 2' },
  { name: 'Projeto 3', id: 3, private: true, description: 'Teste 3' }
];

export const handlers = [
  rest.get('https://api.github.com/users/GabryelleSS/repos', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockObject))
  })
];

const server = setupServer(...handlers);

describe('App', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    useAppSelector.mockImplementation(testUseAppSelector);
    useAppDispatch.mockImplementation(() => dispatch);
  })

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();

    jest.clearAllMocks();
  });
  
  afterAll(() => server.close());

  test('should search the repositories', async () => {
    renderWithProviders(<App />);

    expect(screen.getByText('Sem repos')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId("btn-fetch-repos", { name: 'Buscar repos'}));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    
    expect(await screen.findByText("Projeto 1")).toBeInTheDocument();
    expect(await screen.findByText("Projeto 2")).toBeInTheDocument();
    expect(await screen.findByText("Projeto 3")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Projeto 4")).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("btn-clear-repos", { name: 'Limpar'}));
    expect(screen.getByText("Repos limpos")).toBeInTheDocument();
  });

  test('should return Not Found with status code 404', async () => {
    const errorMessage = "Not Found";

    renderWithProviders(<App />);

    expect(screen.getByText('Sem repos')).toBeInTheDocument();

    userEvent.click(screen.getByTestId("btn-fetch-repos", { name: 'Buscar repos'}));
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    server.use(
      rest.get('https://api.github.com/users/GabryelleSS/repos', async (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ statusText: errorMessage }))
      }),
    );

    await waitFor(() =>
      expect(screen.getByTestId('teste')).toHaveTextContent(errorMessage),
    );
  });

  test('should return Request timeout with status code 408', async () => {
    const errorMessage = "Request Timeout";

    renderWithProviders(<App />);

    expect(screen.getByText('Sem repos')).toBeInTheDocument();

    userEvent.click(screen.getByTestId("btn-fetch-repos", { name: 'Buscar repos'}));
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    server.use(
      rest.get('https://api.github.com/users/GabryelleSS/repos', async (req, res, ctx) => {
        // return res(ctx.status(408), ctx.json({ statusText: errorMessage }))
        return res((res) => {
          res.status = 408;
          res.statusText = errorMessage;
          return res;
        })
      }),
    );

    await waitFor(() =>
      expect(screen.getByTestId('teste')).toHaveTextContent(errorMessage),
    );
  });

  test("should dispatch the action to change the mood", () => {
    render(<App />);
    const btn = screen.getByText("happy");
    userEvent.click(btn);
    
    expect(useAppDispatch).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      "type": 'UPDATE_MOOD',
      "payload": 'happy'
    });
  });
});