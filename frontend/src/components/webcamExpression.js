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
    <div className="text-center">
      {/* Video Container */}
      <div className="relative inline-block mb-lg">
        <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-blue-300">
          <video
            ref={videoRef}
            autoPlay
            muted
            width="640"
            height="480"
            onPlay={handleVideoPlay}
            className="block"
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 pointer-events-none"
          />
        </div>
        
        {/* Overlay Status */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-md py-xs shadow-md border border-gray-200">
          {!modelsLoaded && (
            <span className="text-sm text-gray-600">Loading AI models...</span>
          )}
          {modelsLoaded && !isDetecting && (
            <span className="text-sm text-green-600 font-medium">Ready to detect</span>
          )}
          {isDetecting && (
            <span className="text-sm text-blue-600 font-medium">Analyzing...</span>
          )}
        </div>
      </div>
      
      {/* Status Messages */}
      <div className="space-y-md">
        {!modelsLoaded && (
          <div className="flex items-center justify-center gap-sm text-gray-600">
            <div className="spinner"></div>
            <span>Loading face detection models...</span>
          </div>
        )}
        
        {modelsLoaded && !isDetecting && (
          <div className="space-y-sm">
            <div className="flex items-center justify-center gap-sm text-green-600 font-semibold">
              <span className="text-lg">📹</span>
              <span>Camera ready! Look at the camera to detect your expression</span>
            </div>
            <button 
              onClick={resetDetection}
              className="btn btn-secondary btn-sm"
            >
              <span>🔄</span>
              Reset Detection
            </button>
          </div>
        )}
        
        {isDetecting && (
          <div className="space-y-sm">
            <div className="flex items-center justify-center gap-sm text-blue-600 font-semibold">
              <span className="text-lg">🔍</span>
              <span>Detecting emotion... ({detectionCount}/5)</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-64 mx-auto">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${(detectionCount / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {confidence > 0 && (
              <p className="text-sm text-gray-600">
                Confidence: <span className="font-semibold">{(confidence * 100).toFixed(1)}%</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-lg p-md bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-sm">How it works:</h4>
        <ul className="text-sm text-gray-600 space-y-xs text-left max-w-md mx-auto">
          <li>• Position your face in the camera view</li>
          <li>• The AI will analyze your facial expressions</li>
          <li>• After 5 successful detections, your emotion will be identified</li>
          <li>• Perfect playlists will be recommended based on your mood</li>
        </ul>
      </div>
    </div>
  );
}

export default WebcamExpression;
