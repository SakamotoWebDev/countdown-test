import { useState, useEffect } from "react";
import  Button  from "./ui/button";
import  Input from "./ui/input";

export default function CountdownTimer() {
  const [targetTime, setTargetTime] = useState("");
  const [remainingTime, setRemainingTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTimeColor, setRemainingTimeColor] = useState("#ffffff");
  const [copyMessage, setCopyMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  //Handleshare function, copies countdown end time to clipboard
  const handleShare = () => {
    navigator.clipboard.writeText(targetTime)
      .then(() => {
        setCopyMessage("End time was copied to clipboard");
        setShowMessage(true);
        //keep message visible for 3 seconds
        setTimeout(() => {
          setShowMessage(false);
        //after the fade out (0.5s), clear the message
        setTimeout(()=> setCopyMessage(""), 100);
      }, 3000);
    })
      .catch(err => console.error("Error copying text:", err));
  };
//  const playSound = () => {
//    const audio = new Audio('/sounds/alarm.mp3');
//    audio.play();
//  };

  
  const animateConfetti = (confetti) => {
    // Inside your animateConfetti function:
let startTime = performance.now();
// Generate a random starting rotation between 0 and 360 degrees
const startRotation = Math.random() * 270;
const reverseDirection = Math.random() < 0.5;
const duration = (3 + Math.random() * 3) * 1000; // 3-6 seconds duration

const animate = () => {
  const elapsed = performance.now() - startTime;
  const progress = Math.min(elapsed / duration, 1);

  // Calculate the Y translation and update rotation (adding a full spin over the duration)
  const translateY = progress * window.innerHeight;
  const rotate = startRotation + progress * 360;

  // Apply the transform and fade out the confetti as it falls
  confetti.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
  confetti.style.opacity = 1 - progress;

  if (progress < 1) {
    requestAnimationFrame(animate);
  } else {
    confetti.remove(); // Remove confetti when done
  }
};

requestAnimationFrame(animate);    

    const fallAnimation = () => {
      let elapsedTime = performance.now() - startTime;
      let progress = Math.min(elapsedTime / duration, 1); // Ensure it stops at 1

      let translateY = progress * window.innerHeight;
      let rotate = progress * 180 * (reverseDirection ? -1 : 1); // Half rotation as it falls
      let skewX = Math.sin(progress * Math.PI) * 25 * (reverseDirection ? -1 : 1); // Oscillating skew effect

      confetti.style.transform = `translateY(${translateY}px) rotate(${rotate}deg) skewX(${skewX}deg)`;
      confetti.style.opacity = 1 - progress; // Fade out over time

      if (progress < 1) {
        requestAnimationFrame(fallAnimation);
      } else {
        confetti.remove(); // Remove confetti after animation completes
      }
    };

    requestAnimationFrame(fallAnimation);
  };
  
  const triggerConfetti = () => {
    const confettiContainer = document.createElement("div");
    confettiContainer.style.position = "fixed";
    confettiContainer.style.top = 0;
    confettiContainer.style.left = 0;
    confettiContainer.style.width = "100%";
    confettiContainer.style.height = "100%";
    confettiContainer.style.pointerEvents = "none";
    confettiContainer.style.overflow = "hidden";
    confettiContainer.style.zIndex = "9999";
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 200; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = "20px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.top = "-10px";
      confetti.style.left = `${Math.random() * 100}%`;
      confettiContainer.appendChild(confetti);
      animateConfetti(confetti);
    }
  };
  
  const calculateRemainingTime = () => {
    const targetDate = new Date(targetTime);
    if (isNaN(targetDate)) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const now = new Date();
    const diff = Math.max(Math.floor((targetDate - now) / 1000), 0);
    return {
      days: Math.floor(diff / 86400),
      hours: Math.floor((diff % 86400) / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60
    };
  };
  
  useEffect(() => {
    if (!isRunning) return;
    setRemainingTime(calculateRemainingTime());
    const timer = setInterval(() => {
      setRemainingTime(() => {
        const newTime = calculateRemainingTime();
        if (newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
          setIsRunning(false);
//          playSound();
          triggerConfetti();
          clearInterval(timer);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, targetTime]); //Ensure the effect updates when targetTime changes
  
  const emptyDefault = () => {
    if (!targetTime) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10);
      // Convert to localzone format for datetime-local input
      const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setTargetTime(localTime);
    }
     else {
      setRemainingTime(calculateRemainingTime());
    }
  };
  
  const handleButtonClick = (action, color) => {
    setRemainingTimeColor(color);
    action();
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "20px" }}>Countdown Clock</h1>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "100%", justifyContent: "space-between", }}>
          <Button // Reset button to reset the input field and the countdown timer
            onClick={() => handleButtonClick(() => { 
              setIsRunning(false); 
              setTargetTime(""); 
              setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
            },)} 
            style={{ 
              backgroundColor: "grey", 
              color: "White", 
              fontWeight: "bold", 
              padding: "8px", 
              borderRadius: "10px" 
            }}>
            Reset
          </Button>
          <Input // Input field for the target time
            type="datetime-local"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            style={{ 
              margin: "5px",
              padding: "10px", 
              fontSize: "16px", 
              width: "225px", 
              backgroundColor: "#ffffff", 
              color: "black", 
              fontWeight: "bold" 
            }}
          />
          <Button // Enter button to precalculate the target time
            onClick={() => handleButtonClick(emptyDefault,)} 
            style={{ 
              backgroundColor: "grey", 
              color: "White", 
              fontWeight: "bold", 
              padding: "8px", 
              borderRadius: "10px" 
            }}>
            Enter
          </Button>
        </div>
        <div style={{ 
          fontSize: "32px", 
          fontWeight: "bold",
          margin: "20px", 
          padding: "20px", 
          width: "350px", 
          textAlign: "center",
          Bordercolor: "black", 
          borderRadius: "10px", 
          transition: "background-color .3s ease-in-out", 
          backgroundColor: remainingTimeColor 
        }}>
          {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <Button // Start button to start the countdown timer
            onClick={() => handleButtonClick(() => setIsRunning(true), "#32CD32")} disabled={isRunning} 
            style={{ 
              backgroundColor: "#32CD32", 
              color: "white", 
              borderRadius: "10px",
              padding: "8px",
              fontWeight: "bold",
              }}>
              Start</Button>
        <Button // Pause button to pause the countdown timer
            onClick={() => handleButtonClick(() => setIsRunning(false), "#FFD700")} 
            style={{ 
              backgroundColor: "#FFD700", 
              color: "black", 
              padding: "8px", 
              borderRadius: "10px",
              padding: "8px",
              fontWeight: "bold", 
              }}>
              Pause</Button>
        <Button // Stop button to stop the countdown timer
            onClick={() => handleButtonClick(() => { 
            setIsRunning(false); 
            setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
        }, )} 
            style={{ 
              backgroundColor: "#DC143C",  
              color: "white", 
              padding: "8px", 
              borderRadius: "10px",
              padding: "8px",
              fontWeight: "bold", 
              }}>
              Stop</Button>
      </div>
      <div>
        <Button // Share button to copy the target time to the clipboard
            onClick={handleShare}
            style={{
              backgroundColor: "#1E90FF",
              Bordercolor: "yellow",
              borderweight: "20px",
              padding: "8px",
              fontWeight: "bold",
              color: "white",
              borderRadius: "10px"
              }}>
              Share</Button>
      </div>
        {copyMessage && ( // Display a message when the target time is copied to the clipboard
       <div 
          style={{ 
            position: "fixed",
            bottom: "200px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: copyMessage ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            pointerEvents: "none",
            color: "#1E90FF",
            fontWeight: "bold"
              }}>
                {" target time was copied to the clipboard"}
      </div>
)}

    </div>
  );
}
