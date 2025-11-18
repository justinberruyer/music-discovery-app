import { useEffect, useState } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { fetchUserTopArtists } from '../../api/spotify-me.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import TopArtistItem from '../../components/TopArtistItem/TopArtistItem.jsx';
import './DashboardPage.css';
import '../PageLayout.css';

export default function DashboardPage() {
  const { token, checking } = useRequireToken();

  useEffect(() => {
    document.title = buildTitle('Dashboard');
  }, []);

  useEffect(() => {
    if (checking) return; // still determining token
    if (!token) return; // useRequireToken will redirect to login if missing
    fetchUserTopArtists(token)
      .then((result) => {
        const topArtists = result?.data;
        setFirstArtist(topArtists?.items?.[0] ?? null);
      })
      .catch((err) => {
        console.error('Failed to fetch top artists for dashboard', err);
        setFirstArtist(null);
      });
  }, [token, checking]);

  const [firstArtist, setFirstArtist] = useState(null);

  return (
    <section className="dashboard-page page-container">
      <h1>Dashboard</h1>
      <p className="dashboard-note">Top artist (first item):</p>
      {checking && <p>Loading...</p>}
      {!checking && !firstArtist && <p>No top artist available.</p>}
      {firstArtist && (
        <ol className="dashboard-top-artists">
          <TopArtistItem artist={firstArtist} index={0} />
        </ol>
      )}
    </section>
  );
}

