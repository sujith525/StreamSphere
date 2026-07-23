import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const YOUTUBE_API_KEY = 'AIzaSyDgx5HkdHnSt09Y2n_v8VdcVK2O4cAgcfY';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setUser(storedUser);
    }

    fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=15&key=${YOUTUBE_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.items || []);
      })
      .catch((err) => console.error('YouTube API error:', err));
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/browse');
    } else {
      navigate('/signup');
    }
  };

  const handleVideoClick = (videoId) => {
    if (user) {
      setSelectedVideoId(videoId);
    } else {
      setShowLoginPopup(true);
      setTimeout(() => {
        setShowLoginPopup(false);
        navigate('/signup');
      }, 2000);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative h-[75vh] bg-cover bg-center"
        style={{
          backgroundImage: `url('/fotor-ai-20250629162535.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
        <div className="absolute bottom-10 left-10">
          <h1 className="text-6xl font-black text-white drop-shadow-lg mb-4">
            <span className="text-red-600 animate-pulse">STREAM</span>
            <span className="text-white">SPHERE</span>
          </h1>

          <p className="text-xl mb-6">
            Unlimited Entertainment, Anytime, Anywhere.
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-red-600 px-6 py-3 text-white font-semibold rounded hover:bg-red-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Trending Now */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">🔥 Trending Now</h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {videos.map((video) => {
              const videoId = video.id?.videoId || video.id;
              if (!videoId) return null;

              return (
                <div
                  key={videoId}
                  onClick={() => handleVideoClick(videoId)}
                  className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-105 transition-transform"
                >
                  <img
                    src={video.snippet.thumbnails.high.url}
                    alt={video.snippet.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 text-sm font-semibold">
                    {video.snippet.title}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Loading trending videos...</p>
        )}
      </div>

      {/* Embedded YouTube Player */}
      {selectedVideoId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              className="w-full h-full rounded-lg shadow-xl"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube video player"
            ></iframe>
            <button
              onClick={() => setSelectedVideoId(null)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-xl text-center">
            <p className="text-lg font-semibold mb-2">Login Required</p>
            <p className="text-sm">Please log in to access this video.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
