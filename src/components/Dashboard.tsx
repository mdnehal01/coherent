import React, { useState, useEffect } from 'react';
import { BarChart2, Users, Activity, Database, Upload, FileType, Brain, Play, Trash2, Eye, Cloud, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import DatasetView from './DatasetView';
import ModelInsights from './ModelInsights';
import { supabase } from '../lib/supabase';

interface SavedModel {
  id: string;
  name: string;
  fileName: string;
  targetColumn: string;
  featureColumns: string[];
  createdAt: string;
  accuracy?: number;
  modelType: string;
}

interface UploadedDataset {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url: string;
}

const Dashboard: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<UploadedDataset | null>(null);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<SavedModel | null>(null);
  const [showModelInsights, setShowModelInsights] = useState<SavedModel | null>(null);
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [predictionInputs, setPredictionInputs] = useState<Record<string, number>>({});
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load saved models from localStorage
    const loadSavedModels = () => {
      const saved = localStorage.getItem('savedModels');
      if (saved) {
        setSavedModels(JSON.parse(saved));
      }
    };

    loadSavedModels();
    loadUploadedDatasets();
  }, []);

  const loadUploadedDatasets = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('datasets')
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error loading datasets:', error);
        return;
      }

      const datasets: UploadedDataset[] = data.map(file => ({
        id: file.id || file.name,
        name: file.name,
        size: file.metadata?.size || 0,
        uploadedAt: file.created_at || new Date().toISOString(),
        url: `${supabase.supabaseUrl}/storage/v1/object/public/datasets/${file.name}`
      }));

      setUploadedDatasets(datasets);
    } catch (error) {
      console.error('Error loading datasets:', error);
    }
  };

  const uploadToSupabase = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('datasets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('datasets')
        .getPublicUrl(fileName);

      const newDataset: UploadedDataset = {
        id: data.path,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: publicUrl
      };

      setUploadedDatasets(prev => [...prev, newDataset]);
      toast.success(`${file.name} uploaded to cloud storage successfully!`);
      
      return newDataset;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name} to cloud storage`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = ['.csv', '.xlsx', '.xls'];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      return validTypes.includes(extension);
    });

    if (validFiles.length !== newFiles.length) {
      toast.error('Some files were rejected. Only .csv, .xlsx, and .xls files are allowed.');
    }

    if (validFiles.length > 0) {
      // Add to local files for immediate use
      setFiles(prev => [...prev, ...validFiles]);
      
      // Upload to Supabase storage
      for (const file of validFiles) {
        try {
          await uploadToSupabase(file);
        } catch (error) {
          // Error already handled in uploadToSupabase
        }
      }
      
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  const handleDeleteDataset = async (dataset: UploadedDataset) => {
    try {
      const fileName = dataset.url.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from('datasets')
        .remove([fileName]);

      if (error) {
        throw error;
      }

      setUploadedDatasets(prev => prev.filter(d => d.id !== dataset.id));
      toast.success('Dataset deleted from cloud storage');
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast.error('Failed to delete dataset');
    }
  };

  const handleDownloadDataset = async (dataset: UploadedDataset) => {
    try {
      const fileName = dataset.url.split('/').pop();
      if (!fileName) return;

      const { data, error } = await supabase.storage
        .from('datasets')
        .download(fileName);

      if (error) {
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = dataset.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Dataset downloaded successfully');
    } catch (error) {
      console.error('Error downloading dataset:', error);
      toast.error('Failed to download dataset');
    }
  };

  const handleSelectDataset = async (dataset: UploadedDataset) => {
    try {
      // Download the file and convert to File object for DatasetView
      const fileName = dataset.url.split('/').pop();
      if (!fileName) return;

      const { data, error } = await supabase.storage
        .from('datasets')
        .download(fileName);

      if (error) {
        throw error;
      }

      // Convert blob to File
      const file = new File([data], dataset.name, { type: data.type });
      setSelectedFile(file);
      setSelectedDataset(dataset);
    } catch (error) {
      console.error('Error loading dataset:', error);
      toast.error('Failed to load dataset');
    }
  };

  const handleDeleteModel = (modelId: string) => {
    const updatedModels = savedModels.filter(model => model.id !== modelId);
    setSavedModels(updatedModels);
    localStorage.setItem('savedModels', JSON.stringify(updatedModels));
    
    // Also remove the model from localStorage
    localStorage.removeItem(`model_${modelId}`);
    
    toast.success('Model deleted successfully');
  };

  const handleSelectModel = (model: SavedModel) => {
    setSelectedModel(model);
    toast.success(`Selected model: ${model.name}`);
  };

  const handleViewModelInsights = (model: SavedModel) => {
    setShowModelInsights(model);
  };

  const handlePredict = async (model: SavedModel) => {
    setSelectedModel(model);
    setShowPredictionDialog(true);
  };

  const handleMakePrediction = async () => {
    if (!selectedModel) {
      toast.error('No model selected');
      return;
    }

    try {
      // Load the model
      const loadedModel = await tf.loadLayersModel(`localstorage://model_${selectedModel.id}`);
      
      const inputArray = selectedModel.featureColumns.map(col => Number(predictionInputs[col]));
      const inputTensor = tf.tensor2d([inputArray]);
      
      const prediction = await loadedModel.predict(inputTensor) as tf.Tensor;
      const result = (await prediction.data())[0];
      
      setPredictionResult(Number(result.toFixed(2)));
      toast.success('Prediction completed!');
    } catch (error) {
      console.error('Error making prediction:', error);
      toast.error('Error making prediction. Please check your inputs.');
    }
  };

  // Show model insights page
  if (showModelInsights) {
    return (
      <ModelInsights 
        model={showModelInsights}
        onBack={() => setShowModelInsights(null)}
        onDelete={handleDeleteModel}
        onPredict={handlePredict}
      />
    );
  }

  // Show dataset view
  if (selectedFile) {
    return (
      <DatasetView 
        file={selectedFile} 
        onBack={() => {
          setSelectedFile(null);
          setSelectedDataset(null);
        }}
        selectedModel={selectedModel}
        onModelSaved={(newModel: SavedModel) => {
          const updatedModels = [...savedModels, newModel];
          setSavedModels(updatedModels);
          localStorage.setItem('savedModels', JSON.stringify(updatedModels));
        }}
      />
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <div className="relative">
            <input
              type="file"
              id="fileInput"
              multiple
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer flex items-center gap-2"
            >
              <Upload size={20} />
              Add Your Data
            </label>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Local Files</h3>
              <Database className="text-blue-500" size={24} />
            </div>
            <p className="text-2xl font-bold">{files.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Cloud Datasets</h3>
              <Cloud className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold">{uploadedDatasets.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Trained Models</h3>
              <Brain className="text-purple-500" size={24} />
            </div>
            <p className="text-2xl font-bold">{savedModels.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Selected Model</h3>
              <Play className="text-green-500" size={24} />
            </div>
            <p className="text-lg font-bold truncate">
              {selectedModel ? selectedModel.name : 'None'}
            </p>
          </div>
        </div>

        {/* Cloud Datasets Section */}
        {uploadedDatasets.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Cloud className="text-green-600" size={24} />
              Cloud Datasets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedDatasets.map((dataset) => (
                <div 
                  key={dataset.id} 
                  className="p-4 border rounded-lg transition-all hover:shadow-md hover:border-gray-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">{dataset.name}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDownloadDataset(dataset)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDataset(dataset)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Size: {(dataset.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Uploaded: {new Date(dataset.uploadedAt).toLocaleDateString()}
                  </p>
                  
                  <button
                    onClick={() => handleSelectDataset(dataset)}
                    className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Analyze Dataset
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Models Section */}
        {savedModels.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="text-purple-600" size={24} />
              Saved Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedModels.map((model) => (
                <div 
                  key={model.id} 
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    selectedModel?.id === model.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">{model.name}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleViewModelInsights(model)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="View Insights"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModel(model.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Model"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Dataset: {model.fileName}</p>
                  <p className="text-sm text-gray-600 mb-1">Target: {model.targetColumn}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Features: {model.featureColumns.slice(0, 2).join(', ')}
                    {model.featureColumns.length > 2 && ` +${model.featureColumns.length - 2} more`}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(model.createdAt).toLocaleDateString()}
                    </span>
                    {model.accuracy && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {(model.accuracy * 100).toFixed(1)}% acc
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectModel(model)}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                        selectedModel?.id === model.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedModel?.id === model.id ? 'Selected' : 'Select'}
                    </button>
                    <button
                      onClick={() => handlePredict(model)}
                      className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                    >
                      Predict
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <FileType size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">
            Drag and drop your files here, or click "Add Your Data"
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: .csv, .xlsx, .xls
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Files will be automatically uploaded to cloud storage
          </p>
          {isUploading && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-600">Uploading to cloud...</span>
            </div>
          )}
        </div>

        {/* Local Files List */}
        {files.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Local Files (Session Only)</h2>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-center gap-3">
                    <FileType size={20} className="text-blue-500" />
                    <span>{file.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prediction Dialog */}
        {showPredictionDialog && selectedModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Make Prediction</h3>
              
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">Using model: <strong>{selectedModel.name}</strong></p>
              </div>
              
              <div className="space-y-4 mb-6">
                {selectedModel.featureColumns.map(column => (
                  <div key={column}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {column}
                    </label>
                    <input
                      type="number"
                      value={predictionInputs[column] || ''}
                      onChange={(e) => setPredictionInputs({
                        ...predictionInputs,
                        [column]: e.target.value ? Number(e.target.value) : ''
                      })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder={`Enter value for ${column}`}
                    />
                  </div>
                ))}
              </div>

              {predictionResult !== null && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Predicted {selectedModel.targetColumn}:</p>
                  <p className="text-2xl font-bold text-purple-600">{predictionResult}</p>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowPredictionDialog(false);
                    setPredictionResult(null);
                    setPredictionInputs({});
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={handleMakePrediction}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Predict
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;