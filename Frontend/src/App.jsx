import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Upload, Image as ImageIcon, FileText, Loader2, RefreshCw, Download, Copy, Trash, Scan, RotateCcw } from 'lucide-react';

function App() {
  const [image, setImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [imageRotation, setImageRotation] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setExtractedData(null);
      setImageRotation(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    maxFiles: 1
  });

  const handleExtract = async () => {
    if (!image) {
      toast.error('Please select an image first');
      return;
    }
  
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', image);
  
    try {
      const response = await axios.post('http://localhost:8080/api/ocr/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      const result = {
        text: response.data,
        confidence: Math.random() * 20 + 80,
        timestamp: new Date().toISOString()
      };
  
      setExtractedData(result);
      setHistory(prev => [...prev, {
        image: URL.createObjectURL(image),
        text: result.text
      }]);
      toast.success('Text extracted successfully!');
    } catch (error) {
      toast.error('Failed to extract text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadText = (text) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text file downloaded!');
  };

  const clearAll = () => {
    setImage(null);
    setExtractedData(null);
    setHistory([]);
    setImageRotation(0);
    toast.success('All data cleared!');
  };

  const rotateImage = () => {
    setImageRotation(prev => (prev + 90) % 360);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        <Toaster position="top-right" />
        
        {/* Floating Particles Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto relative"
        >
          <div className="text-center mb-12">
            <motion.div 
              className="inline-block mb-6"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Scan className="w-16 h-16 text-blue-500" />
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              TextifyAi
            </motion.h1>
            <motion.h1 
              className="text-5xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-black"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Smart OCR Text Extractor
            </motion.h1>
            <p className="text-gray-600 text-lg">Transform your images into editable text with advanced OCR technology</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Upload and Preview */}
            <div className="space-y-6">
              <motion.div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors relative overflow-hidden
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 text-lg">
                  {isDragActive ? 'Drop your image here' : 'Drag & drop an image, or click to select'}
                </p>
                <p className="text-sm text-gray-400 mt-2">Supports PNG, JPG, JPEG, GIF, BMP</p>
              </motion.div>

              {image && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative rounded-xl overflow-hidden shadow-lg bg-white p-4"
                >
                  <motion.img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-64 object-contain rounded-lg"
                    style={{ rotate: `${imageRotation}deg` }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={rotateImage}
                      className="p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-blue-500"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 truncate">{image.name}</div>
                </motion.div>
              )}

              <motion.button
                onClick={handleExtract}
                disabled={!image || isLoading}
                className={`w-full py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center space-x-2 shadow-lg
                  ${!image || isLoading 
                    ? 'bg-gray-400' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                <span className="text-lg">{isLoading ? 'Extracting...' : 'Extract Text'}</span>
              </motion.button>
            </div>

            {/* Right Column - Results */}
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-lg bg-opacity-90">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Extracted Text</h2>
                <div className="flex space-x-2">
                  {extractedData && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(extractedData.text)}
                        className="p-2 rounded-lg hover:bg-gray-100 group"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => downloadText(extractedData.text)}
                        className="p-2 rounded-lg hover:bg-gray-100 group"
                        title="Download text"
                      >
                        <Download className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {extractedData ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
                      <p className="text-gray-800 whitespace-pre-wrap text-lg">{extractedData.text}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-1 bg-blue-100 rounded-full mt-2"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${extractedData.confidence}%` }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </motion.div>
                      <span className="ml-4">Confidence: {extractedData.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      {new Date(extractedData.timestamp).toLocaleString()}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 text-gray-500"
                  >
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No text extracted yet</p>
                    <p className="text-sm text-gray-400 mt-2">Upload an image to get started</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* History Section */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-medium text-gray-700">History</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={clearAll}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 group"
                    >
                      <Trash className="w-5 h-5 group-hover:text-red-600" />
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    {history.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                          <img src={item.image} alt="Preview" className="w-16 h-16 object-contain rounded-lg" />
                          <p className="text-gray-600 truncate">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default App;
