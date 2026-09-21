import { act, render } from '@testing-library/react';
import ViewportVideo from './ViewportVideo';

let intersect;
let disconnect;
beforeEach(() => {
  disconnect = jest.fn();
  global.IntersectionObserver = jest.fn(callback => {
    intersect = callback;
    return { observe: jest.fn(), disconnect };
  });
  window.matchMedia = jest.fn(() => ({ matches: false }));
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test('defers the download until visible, pauses offscreen, and releases on unmount', () => {
  const { container, unmount } = render(<ViewportVideo src="/test.mp4" />);
  const video = container.querySelector('video');
  expect(video).not.toHaveAttribute('src');
  act(() => intersect([{ isIntersecting: true }]));
  expect(video).toHaveAttribute('src', '/test.mp4');
  expect(video.play).toHaveBeenCalledTimes(1);
  act(() => intersect([{ isIntersecting: false }]));
  expect(video.pause).toHaveBeenCalledTimes(1);
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(video).not.toHaveAttribute('src');
});

test('does not autoplay when reduced motion is requested', () => {
  window.matchMedia.mockReturnValue({ matches: true });
  render(<ViewportVideo src="/test.mp4" />);
  act(() => intersect([{ isIntersecting: true }]));
  expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
});
