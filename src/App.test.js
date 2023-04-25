import React from 'react'

import { render, screen, fireEvent, waitFor, findByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { renderWithProviders } from './test-utils';
import { useAppDispatch, useAppSelector } from './redux-hooks';
import { testUseAppSelector } from './test-app-selector';

// todo: add teste de sesrvico com timeout / indiponivel

import App from './App';

jest.mock("./redux-hooks");

const mockObject = [
  { name: 'Projeto 1', id: 1, private: false, description: 'Teste' },
  { name: 'Projeto 2', id: 2, private: false, description: 'Teste' },
  { name: 'Projeto 3', id: 3, private: true, description: 'Teste' }
];

export const handlers = [
  rest.get('https://api.github.com/users/GabryelleSS/repos', (req, res, ctx) => {
    return res(ctx.json(mockObject), ctx.delay(150))
  })
];

const server = setupServer(...handlers);

describe('Teste', () => {
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

  test('Renrederizacao', async () => {
    renderWithProviders(<App />);

    expect(screen.getByText('Sem repos')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId("btn-fetch-repos", { name: 'Buscar repos'}));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    
    expect(await screen.findByText("Projeto 1")).toBeInTheDocument();
    // expect(await screen.findByText("Teste")).toBeInTheDocument();
    
    expect(await screen.findByText("Projeto 2")).toBeInTheDocument();
    expect(await screen.findByText("Projeto 3")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Projeto 4")).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId("btn-clear-repos", { name: 'Limpar'}));
    expect(screen.getByText("Repos limpos")).toBeInTheDocument();
  });
});

// describe("App", () => {
//   const dispatch = jest.fn();

//   beforeEach(() => {
//     useAppSelector.mockImplementation(testUseAppSelector);
//     useAppDispatch.mockImplementation(() => dispatch);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("segundo test", () => {
//     render(<App />);
//     const btn = screen.getByText("happy");
//     userEvent.click(btn);
    
//     expect(useAppDispatch).toHaveBeenCalled();
//     expect(dispatch).toHaveBeenCalledWith({
//       "type": 'UPDATE_MOOD',
//       "payload": 'happy'
//     });
//   });
// });