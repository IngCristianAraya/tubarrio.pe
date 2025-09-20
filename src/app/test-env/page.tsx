export default function TestEnvPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Environment Variables Test</h1>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        maxWidth: '800px'
      }}>
        <h3>Firebase Environment Variables:</h3>
        <pre style={{
          backgroundColor: '#2d2d2d',
          color: '#f8f8f2',
          padding: '15px',
          borderRadius: '4px',
          overflowX: 'auto'
        }}>
{`NEXT_PUBLIC_FIREBASE_API_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}
NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing'}
NEXT_PUBLIC_FIREBASE_APP_ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'}

NEXT_PUBLIC_USE_FIREBASE_EMULATOR: ${process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR || 'false'}
NODE_ENV: ${process.env.NODE_ENV}
`}
        </pre>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Note:</h3>
          <p>If you see "Missing" for any Firebase variables, please ensure:</p>
          <ol>
            <li>Your <code>.env.local</code> file exists in the project root</li>
            <li>Variable names start with <code>NEXT_PUBLIC_</code></li>
            <li>You've restarted the development server after making changes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
