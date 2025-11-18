import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildTitle } from '../../constants/appMeta.js';
import { fetchUserTopArtists } from '../../api/spotify-me.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchUserTopTracks } from '../../api/spotify-me.js';
import TopArtistItem from '../../components/TopArtistItem/TopArtistItem.jsx';
import TrackItem from '../../components/TrackItem/TrackItem.jsx';
import { handleTokenError } from '../../utils/handleTokenError.js';
import './DashboardPage.css';
import '../PageLayout.css';

export default function DashboardPage() {
  const { token, checking } = useRequireToken();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = buildTitle('Dashboard');
  }, []);

  useEffect(() => {
    if (checking) return; // still determining token
    if (!token) return; // useRequireToken will redirect to login if missing

    // Fetch top artists
    setLoadingArtists(true);
    setArtistError(null);
    fetchUserTopArtists(token)
      .then((result) => {
        if (handleTokenError(result?.error, navigate)) return;
        if (result?.error) {
          setArtistError(result.error);
          setFirstArtist(null);
        } else {
          const topArtists = result?.data;
          setFirstArtist(topArtists?.items?.[0] ?? null);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch top artists for dashboard', err);
        setArtistError(err?.message || String(err));
        setFirstArtist(null);
      })
      .finally(() => setLoadingArtists(false));

    // Fetch top tracks
    setLoadingTracks(true);
    setTrackError(null);
    fetchUserTopTracks(token)
      .then((result) => {
        if (handleTokenError(result?.error, navigate)) return;
        if (result?.error) {
          setTrackError(result.error);
          setFirstTrack(null);
        } else {
          const topTracks = result?.data;
          setFirstTrack(topTracks?.items?.[0] ?? null);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch top tracks for dashboard', err);
        setTrackError(err?.message || String(err));
        setFirstTrack(null);
      })
      .finally(() => setLoadingTracks(false));
  }, [token, checking, navigate]);

  const [firstArtist, setFirstArtist] = useState(null);
  const [firstTrack, setFirstTrack] = useState(null);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [artistError, setArtistError] = useState(null);
  const [trackError, setTrackError] = useState(null);

  return (
    <section className="dashboard-page page-container">
      <h1>Dashboard</h1>
      <p className="dashboard-note">Your top artist and track</p>

      {/* Loading indicators (tests assert presence by data-testid) */}
      {(checking || loadingTracks) && (
        <p data-testid="loading-tracks-indicator">Loading tracks...</p>
      )}
      {(checking || loadingArtists) && (
        <p data-testid="loading-artists-indicator">Loading artists...</p>
      )}

      {/* After loading finished, render errors or items */}
      {!checking && !loadingArtists && (
        <div>
          {artistError ? (
            <p data-testid="error-artists-indicator">{artistError}</p>
          ) : (
            firstArtist && (
              <ol className="dashboard-top-artists">
                <TopArtistItem artist={firstArtist} index={0} />
              </ol>
            )
          )}
        </div>
      )}

      {!checking && !loadingTracks && (
        <div>
          {trackError ? (
            <p data-testid="error-tracks-indicator">{trackError}</p>
          ) : (
            firstTrack && (
              <ul className="dashboard-top-tracks">
                <TrackItem track={firstTrack} />
              </ul>
            )
          )}
        </div>
      )}
    </section>
  );
}

