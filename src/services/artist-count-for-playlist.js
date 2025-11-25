import { fetchPlaylistById } from '../api/spotify-playlists.js';

/**
 * Count how many times each artist appears in a playlist.
 *
 * This is a small stub for the service. It will be implemented in a following step.
 *
 * @param {string} token Spotify access token
 * @param {string} playlistId Spotify playlist id
 * @returns {Promise<Object|undefined>} mapping { artistName: count } or undefined on error
 */
export async function artistCountForPlaylist(token, playlistId) {
  // Minimal stub: delegate to fetchPlaylistById and return undefined for now.
  // Implementation will be added in the next step.
  try {
    await fetchPlaylistById(token, playlistId);
  } catch (e) {
    // swallow for stub
  }
  return undefined;
}
