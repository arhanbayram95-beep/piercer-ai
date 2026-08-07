import { RenderApiError, renderPreview } from './render';

jest.mock('./config', () => ({
  API_BASE_URL: 'http://localhost:3000',
  USE_MOCK_API: false,
}));

describe('renderPreview', () => {
  const request = { photo: 'cGhvdG8=', jewelryType: 'hoops' as const, finish: 'silver' as const };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('posts the request and returns the rendered image on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ renderedImage: 'cmVuZGVyZWQ=', mimeType: 'image/png' }),
    });

    const result = await renderPreview(request);

    expect(result).toEqual({ renderedImage: 'cmVuZGVyZWQ=', mimeType: 'image/png' });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/render/preview',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    );
  });

  it('throws RenderApiError with the server message on a non-OK response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Unsupported jewelryType: crown' }),
    });

    await expect(renderPreview(request)).rejects.toMatchObject({ message: 'Unsupported jewelryType: crown' });
  });

  it('throws RenderApiError on a network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network down'));

    await expect(renderPreview(request)).rejects.toBeInstanceOf(RenderApiError);
  });
});

describe('renderPreview in mock mode', () => {
  it('echoes the original photo back without calling fetch', async () => {
    jest.resetModules();
    jest.doMock('./config', () => ({ API_BASE_URL: 'http://localhost:3000', USE_MOCK_API: true }));
    global.fetch = jest.fn();

    const { renderPreview: mockedRenderPreview } = require('./render');
    const request = { photo: 'cGhvdG8=', jewelryType: 'hoops' as const, finish: 'silver' as const };

    const result = await mockedRenderPreview(request);

    expect(result).toEqual({ renderedImage: 'cGhvdG8=', mimeType: 'image/jpeg' });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
