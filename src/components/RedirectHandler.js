import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function RedirectHandler() {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToUrl = async () => {
      try {
        const urlsRef = collection(db, 'urls');
        const q = query(urlsRef, where('shortCode', '==', shortCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const urlDoc = querySnapshot.docs[0];
          const urlData = urlDoc.data();

          // Check if URL has expired
          if (urlData.expirationDate && new Date(urlData.expirationDate) < new Date()) {
            toast.error('This link has expired');
            navigate('/');
            return;
          }

          // Update analytics
          const analytics = {
            ...urlData.analytics,
            timestamps: [...urlData.analytics.timestamps, new Date().toISOString()],
            devices: {
              ...urlData.analytics.devices,
              [/mobile/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop']:
                (urlData.analytics.devices[/mobile/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'] || 0) + 1
            },
            browsers: {
              ...urlData.analytics.browsers,
              [getBrowser()]: (urlData.analytics.browsers[getBrowser()] || 0) + 1
            }
          };

          // Update click count and analytics
          await updateDoc(urlDoc.ref, {
            clicks: urlData.clicks + 1,
            analytics
          });

          // Redirect to original URL
          window.location.href = urlData.originalUrl;
        } else {
          toast.error('URL not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error redirecting:', error);
        toast.error('Error redirecting to URL');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    redirectToUrl();
  }, [shortCode]);

  const getBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
    return 'Other';
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}