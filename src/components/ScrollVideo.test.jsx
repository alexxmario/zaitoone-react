import { act, fireEvent, render } from '@testing-library/react';
import ScrollVideo from './ScrollVideo';

let requests;
let draw;
beforeEach(() => {
  requests = [];
  draw = jest.fn();
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: draw });
  jest.spyOn(window, 'Image').mockImplementation(() => {
    const image = { width: 1280, height: 720, decode: () => Promise.resolve() };
    requests.push(image);
    return image;
  });
});
afterEach(() => jest.restoreAllMocks());

test('limits concurrent frame loads and draws as soon as the first frame decodes', async () => {
  render(<ScrollVideo />);
  expect(requests).toHaveLength(3);
  await act(async () => requests[0].onload());
  expect(draw).toHaveBeenCalled();
  expect(requests).toHaveLength(4);
});

test('continues after a missing frame and stops queuing after unmount', async () => {
  const { unmount } = render(<ScrollVideo />);
  await act(async () => requests[0].onerror());
  expect(requests).toHaveLength(4);
  unmount();
  await act(async () => requests[1].onload());
  expect(requests).toHaveLength(4);
});


test('prioritizes a large scroll jump and redraws the arriving frame without another scroll', async () => {
  let scheduled;
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    scheduled = callback;
    return 1;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(3000);
  const { unmount } = render(<ScrollVideo />);
  await act(async () => requests[0].onload());
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 3000 });
  fireEvent.scroll(window);
  act(() => scheduled());
  await act(async () => requests[1].onload());
  const lastFrame = requests.find(image => image.src.endsWith('frame_0146.jpg'));
  expect(lastFrame).toBeDefined();
  draw.mockClear();
  await act(async () => lastFrame.onload());
  expect(draw.mock.calls.some(call => call[0] === lastFrame)).toBe(true);
  unmount();
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
});
