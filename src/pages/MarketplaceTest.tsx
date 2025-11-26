import React from 'react';

const MarketplaceTest = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>MARKETPLACE TEST PAGE</h1>
      <p>If you can see this, the routing works but the original Marketplace has issues.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  );
};

export default MarketplaceTest;
