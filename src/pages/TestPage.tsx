export default function TestPage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'sans-serif',
      textAlign: 'center',
      marginTop: '50px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '600px',
      margin: '50px auto',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#2d3748' }}>Test Page</h1>
      <p style={{ color: '#4a5568', fontSize: '18px' }}>If you can see this, the app is working!</p>
      <p style={{ color: '#718096', marginTop: '20px' }}>Check the browser console for any errors.</p>
    </div>
  );
}
