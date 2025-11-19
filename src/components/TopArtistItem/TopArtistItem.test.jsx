// src/components/PlayListItem.test.jsx

import { describe, expect, test } from '@jest/globals'
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import TopArtistItem from './TopArtistItem';

describe('TopArtistItem component', () => {
    test('renders artist information correctly', () => {
        const artist = {
            id: 'artist1',
            name: 'Test Artist',
            images: [{ url: 'test.jpg' }, { url: 'test-medium.jpg' }, { url: 'test-small.jpg' }],
            genres: ['pop', 'rock'],
            followers: { total: 100 },
            popularity: 85,
            external_urls: { spotify: 'https://open.spotify.com/artist/artist1' }
        };
    // render with index=0 to reflect current bug (UI shows index starting at 0)
    // the test asserts that the label should show index 1 for index 0 — it will fail
    // until the bug is fixed (this is intentional).
    render(<TopArtistItem artist={artist} index={0} />);

        // Verify list item rendering and having expected content
        const listItem = screen.getByTestId(`top-artist-item-${artist.id}`);
        expect(listItem).toBeInTheDocument();

        // should contain artist image (use alt text)
        const img = within(listItem).getByAltText(artist.name);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', artist.images[1].url);

        // details assertions
        expect(listItem).toHaveTextContent(artist.name);
        expect(listItem).toHaveTextContent(`Genres: ${artist.genres.join(', ')}`);
        expect(listItem).toHaveTextContent(`Followers: ${artist.followers.total.toLocaleString()}`);
        expect(listItem).toHaveTextContent(`Popularity: ${artist.popularity}`);

        // link to artist page
        const link = within(listItem).getByRole('link', { name: /view artist/i });
        expect(link).toHaveAttribute('href', artist.external_urls.spotify);

    // Verify displayed index shows 1 for user-facing label.
    // Accept an optional dot after the index (e.g. "1. Test Artist")
    expect(listItem).toHaveTextContent(/1\.?\s*Test Artist/);

        // uncomment to debug
        //screen.debug();
    });

    test('handles missing artist image gracefully', () => {
        const artist = {
            id: 'artist2',
            name: 'No Image Artist',
            genres: ['jazz'],
            // images: [],
            followers: { total: 500 },
            external_urls: { spotify: 'https://open.spotify.com/artist/artist2' }
        };
    // use index=0 here as well to reflect pre-fix behaviour
    render(<TopArtistItem artist={artist} index={0} />);

        // Verify list item rendering and having expected content
        const listItem = screen.getByTestId(`top-artist-item-${artist.id}`);
        expect(listItem).toBeInTheDocument();

        // should not contain artist image (query by alt)
        expect(within(listItem).queryByAltText(artist.name)).not.toBeInTheDocument();

        // details assertions
        expect(listItem).toHaveTextContent(artist.name);
        expect(listItem).toHaveTextContent(`Genres: ${artist.genres.join(', ')}`);
        expect(listItem).toHaveTextContent(`Followers: ${artist.followers.total.toLocaleString()}`);

        // link to artist page
        const link = within(listItem).getByRole('link', { name: /view artist/i });
        expect(link).toHaveAttribute('href', artist.external_urls.spotify);

        // uncomment to debug
        //screen.debug();
    });
});