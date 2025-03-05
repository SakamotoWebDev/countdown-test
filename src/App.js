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
        minHeight: '30vh'            // Take 30% viewport height
      }}
    >
      <img src={image} alt="logo" style={{ scale: '.7', margin: '20px', }} />
      <CountdownTimer />
    </div>
  );
}

export default App;