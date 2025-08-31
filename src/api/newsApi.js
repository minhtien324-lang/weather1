import axios from 'axios';

// Note: Directly fetching RSS XML from the browser can hit CORS restrictions.
// We use a JSON RSS proxy for simplicity. For production, consider proxying via your backend.
const RSS_URL = 'https://news.google.com/rss/search?q=thoi+tiet&hl=vi&gl=VN&ceid=VN:vi';
const RSS2JSON_ENDPOINT = 'https://api.rss2json.com/v1/api.json';

export async function fetchGoogleNews() {
    try {
        const response = await axios.get(RSS2JSON_ENDPOINT, {
            params: {
                rss_url: RSS_URL
            },
            timeout: 15000
        });

        const data = response.data || {};
        if (!data.items || !Array.isArray(data.items)) {
            return [];
        }

        // Normalize items
        return data.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            author: item.author || (item.creator || ''),
            thumbnail: item.thumbnail || '',
            description: item.description || ''
        }));
    } catch (error) {
        console.error('Failed to fetch Google News RSS:', error);
        throw new Error('Không thể tải tin tức Google News');
    }
}




