import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KEY_ACCESS_TOKEN } from '../../constants/storageKeys.js';
import { fetchPlaylistById } from '../../api/spotify-playlists.js';
import { handleTokenError } from '../../utils/handleTokenError.js';
import TrackItem from '../../components/TrackItem/TrackItem.jsx';
import '../../styles/PlaylistDetailPage.css';

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Playlist | Spotify App';
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const token = window.localStorage.getItem(KEY_ACCESS_TOKEN);
      try {
        const res = await fetchPlaylistById(token, id);
        // support both shapes: { data, error } or { playlist, error }
        const data = res?.data ?? res?.playlist ?? null;
        const err = res?.error ?? null;

        if (err) {
          // If token expired, handleTokenError will redirect
          handleTokenError(err, navigate);
          setError(err);
          setPlaylist(null);
        } else if (!data) {
          setError('Playlist not found');
          setPlaylist(null);
        } else {
          setPlaylist(data);
        }
      } catch (e) {
        const message = e?.message ?? 'Failed to fetch playlist.';
        handleTokenError(message, navigate);
        setError(message);
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <div data-testid="loading-indicator">Loading playlist...</div>
      </div>
    );
  }

  if (error) {
    return <div role="alert">{error}</div>;
  }

  if (!playlist) {
    return <div role="alert">Playlist not found</div>;
  }

  const tracks = playlist.tracks?.items ?? [];

  return (
    <main>
      <header className="playlist-header">
        <img src={playlist.images?.[0]?.url} alt={`Cover of ${playlist.name}`} />
        <div className="playlist-header-info">
          <h1>{playlist.name}</h1>
          {playlist.description && <h2>{playlist.description}</h2>}
          {playlist.external_urls?.spotify && (
            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
          )}
        </div>
      </header>

      <section className="playlist-tracks">
        <ul className="list">
          {tracks.length === 0 && <div>No tracks in this playlist</div>}
          {tracks.map((item) => {
            const track = item.track ?? item;
            return <TrackItem key={track.id} track={track} />;
          })}
        </ul>
      </section>
    </main>
  );
}
