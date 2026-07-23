import { useEffect, useRef, useState } from 'react';
import PageWrapper from './PageWrapper';

const API_KEY = 'AIzaSyDgx5HkdHnSt09Y2n_v8VdcVK2O4cAgcfY';

const categoriesList = [
  'All', 'Action', 'Comedy', 'Drama', 'Romance', 'Horror', 'Thriller',
  'Animation', 'Sci-Fi', 'Fantasy', 'Documentary', 'Sports', 'Music',
  'Songs', 'News', 'Technology', 'Gaming', 'Education', 'India', 'Telugu', 'Tamil', 'Kids', 'Devotional'
];

function Browse() {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const videoSectionRef = useRef(null);

  useEffect(() => {
    fetchVideos(category === 'All' ? 'trending India' : category);
  }, [category]);

  const fetchVideos = async (query) => {
    try {
      const mediumRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${query}&type=video&videoDuration=medium&key=${API_KEY}`
      );
      const mediumData = await mediumRes.json();
      let results = mediumData.items;

      if (!results || results.length === 0) {
        const shortRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${query}&type=video&videoDuration=short&key=${API_KEY}`
        );
        const shortData = await shortRes.json();
        results = shortData.items;
      }

      if (!results || results.length === 0) {
        const fallbackRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=trending India&type=video&key=${API_KEY}`
        );
        const fallbackData = await fallbackRes.json();
        results = fallbackData.items;
      }

      setVideos(results || []);
      setCurrentVideoId(null);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchVideos(searchTerm);
      setShowPreview(false);
      videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlay = (videoId) => {
    setCurrentVideoId(videoId);
    setTimeout(() => {
      const iframe = document.getElementById(`iframe-${videoId}`);
      iframe?.requestFullscreen?.();
    }, 300);
  };

  const handleSearchTyping = async (value) => {
    setSearchTerm(value);
    if (value.length > 2) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${value}&type=video&key=${API_KEY}`
      );
      const data = await res.json();
      setSearchResults(data.items || []);
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <PageWrapper noTitle>
        <div className="flex justify-center mt-6 mb-3 relative z-20">
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-3xl bg-white rounded overflow-hidden shadow-lg relative"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchTyping(e.target.value)}
              placeholder="Search for videos..."
              className="flex-grow px-6 py-4 text-black text-lg focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 px-6 py-4 text-white text-lg font-semibold hover:bg-red-700"
            >
              🔍
            </button>
          </form>

          {showPreview && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 bg-white text-black rounded shadow-lg w-full max-w-3xl overflow-hidden">
              {searchResults.map((video) => (
                <div
                  key={video.id.videoId}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(video.snippet.title);
                    fetchVideos(video.snippet.title);
                    setShowPreview(false);
                    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className="w-12 h-8 rounded object-cover"
                  />
                  <p className="text-sm">{video.snippet.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto whitespace-nowrap px-4 py-2 scrollbar-hide">
          <div className="flex gap-3 w-max">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSearchTerm('');
                  setShowPreview(false);
                  videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  category === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div ref={videoSectionRef} className="mt-6 px-4 pb-10">
          {videos.length === 0 ? (
            <p className="text-center text-gray-400">Loading videos...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video) => {
                const videoId = video.id?.videoId || video.id;
                if (!videoId) return null;

                const isPlaying = videoId === currentVideoId;

                return (
                  <div
                    key={videoId}
                    className="bg-gray-900 text-white p-2 rounded shadow hover:scale-105 transition cursor-pointer"
                    onClick={() => handlePlay(videoId)}
                  >
                    {isPlaying ? (
                      <iframe
                        id={`iframe-${videoId}`}
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                        title={video.snippet.title}
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="rounded"
                      />
                    ) : (
                      <img
                        src={video.snippet.thumbnails?.medium?.url}
                        alt={video.snippet.title}
                        className="w-full h-[200px] object-cover rounded"
                      />
                    )}
                    <h3 className="mt-2 font-semibold text-sm">{video.snippet.title}</h3>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
}

export default Browse;
