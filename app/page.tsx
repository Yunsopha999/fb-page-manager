'use client';

import { useState } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // មុខងារទាញយកបញ្ជី Page ពី Backend API របស់យើង
  const fetchFacebookPages = async (userAccessToken) => {
    if (!userAccessToken) {
      setError('សូមបញ្ចូល Access Token ជាមុនសិន!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/pages?access_token=${userAccessToken}`);
      const data = await res.json();

      if (res.ok) {
        setPages(data.pages);
      } else {
        setError(data.error || 'Failed to fetch pages');
      }
    } catch (err) {
      setError('មានបញ្ហាក្នុងការទាក់ទងទៅកាន់ Server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Facebook Page Manager App</h1>
        
        {/* Input សម្រាប់ដាក់ User Access Token ដែលបានពី Meta Graph API Explorer */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook User Access Token:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="បិទភ្ជាប់ Access Token ទីនេះ..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => fetchFacebookPages(token)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              ទាញយក Page
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ចំណាំ៖ អ្នកអាចយក Token ដែលបាន Copy ពី Graph API Explorer មកដាក់ទីនេះ។
          </p>
        </div>

        {/* បង្ហាញ Loading ឬ Error */}
        {loading && <p className="text-blue-600">កំពុងទាញយកទិន្នន័យ...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* បង្ហាញបញ្ជី Page ដែលទាញបាន */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">បញ្ជី Facebook Pages របស់អ្នក៖</h2>
          {pages.length === 0 ? (
            <p className="text-gray-400">គ្មាន Page ត្រូវបង្ហាញទេ (សូមបញ្ចូល Token រួចចុចទាញយក)</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pages.map((page) => (
                <div key={page.id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-800">{page.name}</h3>
                    <p className="text-xs text-gray-500">ID: {page.id}</p>
                  </div>
                  <button 
                    onClick={() => alert(`បានជ្រើសរើស Page: ${page.name}\nPage Token: ${page.access_token}`)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-green-700"
                  >
                    គ្រប់គ្រងផេកនេះ
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}