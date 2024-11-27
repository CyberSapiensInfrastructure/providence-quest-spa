import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Twitter API tipleri
interface TwitterUser {
  id: string;
  username: string;
}

interface TwitterApiResponse {
  data: {
    id: string;
  }[];
}

// Twitter OAuth 2.0 URLs
const TWITTER_OAUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';

const isDevelopment = process.env.NODE_ENV === 'development';
const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:3001';

app.use(cors({
  origin: ['http://localhost:5173', 'https://providence-quest-spa.onrender.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/twitter/auth', (req: Request, res: Response) => {
  const clientId = process.env.TWITTER_CLIENT_ID;
  
  if (!clientId) {
    console.error('Twitter Client ID is missing');
    return res.status(500).json({
      success: false,
      error: 'Twitter configuration is missing'
    });
  }

  console.log('=== Auth Request Debug ===');
  console.log('1. Client ID:', clientId);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: 'http://localhost:3001/api/twitter/callback',
    scope: 'tweet.read users.read like.read',
    state: Math.random().toString(36).substring(7)
  });

  const authUrl = `${TWITTER_OAUTH_URL}?${params.toString()}`;
  console.log('2. Generated Auth URL:', authUrl);

  res.json({ authUrl });
});

app.get('/api/twitter/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;
  
  // Gelen code'u console'a yazdır
  console.log('=== Callback Debug ===');
  console.log('1. Received code:', code);
  console.log('2. State:', state);

  try {
    // Token almayı dene
    console.log('3. Attempting to get token with code...');
    const tokenResponse = await axios.post(TWITTER_TOKEN_URL, 
      new URLSearchParams({
        code: code as string,
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!,
        client_secret: process.env.TWITTER_CLIENT_SECRET!,
        redirect_uri: `${BACKEND_URL}/api/twitter/callback`,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('4. Token Response:', tokenResponse.data);
    const { access_token } = tokenResponse.data;

    // Manuel test için HTML sayfası döndür
    res.send(`
      <html>
        <body>
          <h1>Auth Successful!</h1>
          <h2>Debug Info:</h2>
          <pre>
            Code: ${code}
            Access Token: ${access_token}
          </pre>
          <p>You can use this token to manually test the like check:</p>
          <code>
            curl -X POST "http://localhost:3001/api/check-twitter-like" \\
              -H "Content-Type: application/json" \\
              -d '{"username": "hrnsekmencode", "accessToken": "${access_token}"}'
          </code>
          <script>
            // Hala window.opener.postMessage'ı da çalıştır
            if (window.opener) {
              window.opener.postMessage(
                { 
                  type: 'TWITTER_AUTH_SUCCESS', 
                  accessToken: '${access_token}'
                }, 
                '${FRONTEND_URL}'
              );
            }
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Token error:', error);
    // Hata detaylarını göster
    res.send(`
      <html>
        <body>
          <h1>Auth Failed!</h1>
          <h2>Debug Info:</h2>
          <pre>
            Code: ${code}
            Error: ${JSON.stringify(error, null, 2)}
          </pre>
        </body>
      </html>
    `);
  }
});

// Like kontrolü için endpoint
app.post('/api/check-twitter-like', async (req: Request, res: Response) => {
  const { username, accessToken } = req.body;
  const TARGET_TWEET_ID = '1858888925281976397';

  try {
    console.log('Checking likes for:', username);
    
    // Kullanıcı ID'sini al
    const userResponse = await axios.get(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const userId = userResponse.data.data.id;
    console.log('Found user ID:', userId);

    // Like'ları kontrol et
    const likesResponse = await axios.get(
      `https://api.twitter.com/2/users/${userId}/liked_tweets`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          'max_results': 100,
          'tweet.fields': 'id',
        },
      }
    );

    const hasLiked = likesResponse.data.data?.some(
      (tweet: { id: string }) => tweet.id === TARGET_TWEET_ID
    );

    console.log('Has liked target tweet:', hasLiked);
    res.json({ success: true, hasLiked });
  } catch (error) {
    console.error('Error checking likes:', error);
    res.status(500).json({ success: false, error: 'Failed to check likes' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- Twitter Bearer Token:', process.env.TWITTER_BEARER_TOKEN ? '✓ Present' : '✗ Missing');
  console.log('- API Key:', process.env.TWITTER_API_KEY ? '✓ Present' : '✗ Missing');
  console.log('- API Secret:', process.env.TWITTER_API_SECRET ? '✓ Present' : '✗ Missing');
}); 