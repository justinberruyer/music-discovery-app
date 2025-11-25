import { fetchPlaylistById } from '../api/spotify-playlists.js';

/**
 * Count how many times each artist appears in a playlist.
 *
 * @param {string} token Spotify access token
 * @param {string} playlistId Spotify playlist id
 * @returns {Promise<Object|undefined>} mapping { artistName: count } or undefined on error
 */
export async function artistCountForPlaylist(token, playlistId) {
  try {
    const res = await fetchPlaylistById(token, playlistId);
    // support both shapes returned by different implementations/mocks
    const data = res?.data ?? res?.playlist ?? null;

    if (res?.error) {
      console.error('Error fetching playlist', res.error);
      return undefined;
    }

    if (!data) {
      // no data -> treat as empty
      return {};
    }

    const items = data.tracks?.items ?? [];
    const counts = {};

    for (const item of items) {
      const track = item.track ?? item;
      const artists = track?.artists ?? [];
      for (const artist of artists) {
        const name = artist?.name ?? 'Unknown';
        counts[name] = (counts[name] || 0) + 1;
      }
    }

    return counts;
  } catch (err) {
    console.error('Error fetching playlist', err);
    return undefined;
  }
}
