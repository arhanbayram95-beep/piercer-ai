import { MatchApiError, matchPhoto } from './match';

jest.mock('./config', () => ({
  API_BASE_URL: 'http://localhost:3000',
  USE_MOCK_API: false,
}));

describe('matchPhoto', () => {
  const request = { photo: 'cGhvdG8=' };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('posts the request and returns recommendations on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ recommendations: [{ locationId: 'helix', reason: 'Great ear shape for it.' }] }),
    });

    const result = await matchPhoto(request);

    expect(result).toEqual({ recommendations: [{ locationId: 'helix', reason: 'Great ear shape for it.' }] });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/match/photo',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    );
  });

  it('throws MatchApiError with the server message on a non-OK response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Bad request' }),
    });

    await expect(matchPhoto(request)).rejects.toMatchObject({ message: 'Bad request' });
  });

  it('throws MatchApiError on a network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network down'));

    await expect(matchPhoto(request)).rejects.toBeInstanceOf(MatchApiError);
  });
});

describe('matchPhoto in mock mode', () => {
  it('returns fixed recommendations without calling fetch', async () => {
    jest.resetModules();
    jest.doMock('./config', () => ({ API_BASE_URL: 'http://localhost:3000', USE_MOCK_API: true }));
    global.fetch = jest.fn();

    const { matchPhoto: mockedMatchPhoto } = require('./match');
    const result = await mockedMatchPhoto({ photo: 'cGhvdG8=' });

    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
