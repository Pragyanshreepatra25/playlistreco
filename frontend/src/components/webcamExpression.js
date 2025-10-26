import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

function WebcamExpression({ onEmotionDetected }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const intervalRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        setModelsLoaded(true);
        startVideo();
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error accessing webcam:', err));
  };

  const handleVideoPlay = () => {
    if (!modelsLoaded || isDetecting) return;

    setIsDetecting(true);
    let emotionCounts = {};
    let totalDetections = 0;

    intervalRef.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        try {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (detections.length > 0) {
            const expressions = detections[0].expressions;
            const maxExpression = Object.keys(expressions).reduce((a, b) => 
              expressions[a] > expressions[b] ? a : b
            );
            
            const maxConfidence = expressions[maxExpression];
            
            // Only consider emotions with confidence > 0.3
            if (maxConfidence > 0.3) {
              emotionCounts[maxExpression] = (emotionCounts[maxExpression] || 0) + 1;
              totalDetections++;
              setConfidence(maxConfidence);
              
              // After 5 detections, determine the most frequent emotion
              if (totalDetections >= 5) {
                const mostFrequentEmotion = Object.keys(emotionCounts).reduce((a, b) => 
                  emotionCounts[a] > emotionCounts[b] ? a : b
                );
                onEmotionDetected(mostFrequentEmotion);
                setDetectionCount(totalDetections);
                clearInterval(intervalRef.current);
                setIsDetecting(false);
              }
            }

            // Draw on canvas
            const canvas = canvasRef.current;
            const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          }
        } catch (error) {
          console.error('Detection error:', error);
        }
      }
    }, 500); // Faster detection for better responsiveness
  };

  const resetDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsDetecting(false);
    setDetectionCount(0);
    setConfidence(0);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="640"
          height="480"
          onPlay={handleVideoPlay}
          style={{ borderRadius: '8px', border: '2px solid #007bff' }}
        />
        <canvas 
          ref={canvasRef} 
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        {!modelsLoaded && (
          <p style={{ color: '#666' }}>Loading face detection models...</p>
        )}
        
        {modelsLoaded && !isDetecting && (
          <div>
            <p style={{ color: '#28a745', fontWeight: 'bold' }}>
              📹 Camera ready! Look at the camera to detect your expression
            </p>
            <button 
              onClick={resetDetection}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Reset Detection
            </button>
          </div>
        )}
        
        {isDetecting && (
          <div>
            <p style={{ color: '#ffc107', fontWeight: 'bold' }}>
              🔍 Detecting emotion... ({detectionCount}/5)
            </p>
            <div style={{ 
              width: '200px', 
              height: '10px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '5px',
              margin: '10px auto',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(detectionCount / 5) * 100}%`,
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            {confidence > 0 && (
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                Confidence: {(confidence * 100).toFixed(1)}%
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WebcamExpression;
