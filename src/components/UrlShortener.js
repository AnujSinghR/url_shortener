import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import shortid from 'shortid';

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const { currentUser } = useAuth();

  const generateShortCode = () => {
    return customAlias || shortid.generate();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl) {
      toast.error('Please enter a URL');
      return;
    }

    try {
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      setLoading(true);
      const shortCode = generateShortCode();

      // Check if custom alias is already in use
      if (customAlias) {
        const urlsRef = collection(db, 'urls');
        const q = query(urlsRef, where('shortCode', '==', shortCode));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          toast.error('Custom alias is already in use');
          return;
        }
      }

      const urlData = {
        originalUrl: longUrl,
        shortCode,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        clicks: 0,
        expirationDate: expirationDate || null,
        analytics: {
          devices: {},
          browsers: {},
          timestamps: []
        }
      };

      await addDoc(collection(db, 'urls'), urlData);
      const shortUrl = `${window.location.origin}/${shortCode}`;
      setShortenedUrl(shortUrl);
      toast.success('URL shortened successfully!');
      setLongUrl('');
      setCustomAlias('');
      setExpirationDate('');
    } catch (error) {
      console.error('Error creating short URL:', error);
      toast.error('Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Shorten Your URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Long URL</label>
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="https://example.com/very-long-url"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Custom Alias (Optional)</label>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="custom-alias"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expiration Date (Optional)</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Creating...' : 'Create Short URL'}
        </button>
      </form>
      {shortenedUrl && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700">Shortened URL:</p>
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={shortenedUrl}
              readOnly
              className="flex-1 p-2 border rounded-md text-sm bg-white"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shortenedUrl);
                toast.success('Copied to clipboard!');
              }}
              className="ml-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}