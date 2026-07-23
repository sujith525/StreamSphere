import { useEffect, useState } from 'react';

function PageWrapper({ title, children }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('videos');
    if (stored) {
      setVideos(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="relative  text-white min-h-screen overflow-hidden">
      {/* Floating YouTube thumbnails */}
      <div className="absolute inset-0 -z-10 opacity-20 blur-sm pointer-events-none">
        <div className="absolute w-full h-full flex flex-wrap items-center justify-center gap-6">
          {videos.map((video, index) => {
            const id = extractYouTubeID(video.url);
            return id ? (
              <img
                key={index}
                src={`https://img.youtube.com/vi/${id}/0.jpg`}
                alt={video.title}
                className="w-32 h-20 object-cover rounded shadow-md"
                style={{
                  animation: `float ${3 + (index % 3)}s ease-in-out infinite alternate`,
                }}
              />
            ) : null;
          })}
        </div>
      </div>

      {/* Header with logo and title */}
      <div className="relative z-10 h-[25vh] flex flex-col justify-end p-10 bg-gradient-to-t from-black via-transparent to-black">
  <h1 className="text-5xl font-black">
    <span className="text-red-600">STREAM</span>
    <span className="text-white">SPHERE</span>
  </h1>
  <p className="text-gray-300 mt-2">Browse All Available Videos</p>
</div>


      {/* Main content */}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}

// ✅ Improved: handles various YouTube URL formats
function extractYouTubeID(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    } else if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
  } catch (e) {
    return '';
  }
  return '';
}

export default PageWrapper;
