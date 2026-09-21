import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/CustomCursor', () => () => null);
jest.mock('./components/Navigation', () => () => <nav>Navigation</nav>);
jest.mock('./components/Footer', () => () => <footer>Footer</footer>);
jest.mock('./pages/Menu', () => () => <h1>Meniu</h1>);
jest.mock('./pages/Home', () => () => <h1>Zaitoone</h1>);

test('renders the home route and shared navigation', () => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Zaitoone' })).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  jest.restoreAllMocks();
});


test('loads a split route when opened directly', async () => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  window.history.replaceState({}, '', '/menu');
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Meniu' })).toBeInTheDocument();
  window.history.replaceState({}, '', '/');
  jest.restoreAllMocks();
});
