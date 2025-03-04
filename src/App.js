import React from "react";
import image from './logo.webp';
import CountdownTimer from "./components/CountdownClock";

function App() {
  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',      // Stack items vertically
        alignItems: 'center',         // Center horizontally
        justifyContent: 'center',     // Center vertically
        minHeight: '70vh'            // Take full viewport height
      }}
    >
      <img src={image} alt="logo" style={{ marginBottom: '20px' }} />
      <CountdownTimer />
    </div>
  );
}

export default App;