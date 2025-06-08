import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Brain, 
  Target, 
  Zap, 
  Clock, 
  TrendingUp, 
  Database, 
  Settings, 
  BarChart3,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Play,
  Trash2,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';
import * as tf from '@tensorflow/tfjs';
import { geminiAI } from '../lib/gemini';

interface SavedModel {
  id: string;
  name: string;
  fileName: string;
  targetColumn: string;
  featureColumns: string[];
  createdAt: string;
  accuracy?: number;
  modelType: string;
  trainingTime?: number;
  epochs?: number;
  learningRate?: number;
  loss?: number;
  validationLoss?: number;
  trainingHistory?: {
    epoch: number;
    loss: number;
    val_loss?: number;
  }[];
}

interface ModelInsightsProps {
  model: SavedModel;
  onBack: () => void;
  onDelete: (modelId: string) => void;
  onPredict: (model: SavedModel) => void;
}

const ModelInsights: React.FC<ModelInsightsProps> = ({ model, onBack, onDelete, onPredict }) => {
  const [loadedModel, setLoadedModel] = useState<tf.LayersModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelSummary, setModelSummary] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
<<<<<<< HEAD
=======
  const [isExporting, setIsExporting] = useState(false);
>>>>>>> 97bfcc7 (Added the team functionality)

  useEffect(() => {
    loadModelDetails();
    generateAIInsights();
  }, [model.id]);

  const loadModelDetails = async () => {
    setIsLoading(true);
    try {
      const tfModel = await tf.loadLayersModel(`localstorage://model_${model.id}`);
      setLoadedModel(tfModel);
      
      // Generate model summary
      const summary = generateModelSummary(tfModel);
      setModelSummary(summary);
    } catch (error) {
      console.error('Error loading model:', error);
      toast.error('Error loading model details');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    
    try {
      const insights = await geminiAI.generateModelInsights(model);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      
      // Fallback insights
      const fallbackInsights = `This ${model.modelType} model predicts ${model.targetColumn} using ${model.featureColumns.length} features. ` +
        `With ${model.accuracy ? `${(model.accuracy * 100).toFixed(1)}% accuracy` : 'trained performance'}, ` +
        `it can be used for regression analysis and predictive modeling. ` +
        `Consider feature engineering and hyperparameter tuning to improve performance.`;
      
      setAiInsights(fallbackInsights);
      toast.error('AI insights generation failed. Using fallback analysis.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const generateModelSummary = (tfModel: tf.LayersModel): string => {
    let summary = 'Model Architecture:\n\n';
    
    tfModel.layers.forEach((layer, index) => {
      const config = layer.getConfig();
      summary += `Layer ${index + 1}: ${layer.constructor.name}\n`;
      
      if (config.units) {
        summary += `  - Units: ${config.units}\n`;
      }
      if (config.activation) {
        summary += `  - Activation: ${config.activation}\n`;
      }
      if (layer.inputShape) {
        summary += `  - Input Shape: [${layer.inputShape.join(', ')}]\n`;
      }
      summary += '\n';
    });

    const totalParams = tfModel.countParams();
    summary += `Total Parameters: ${totalParams.toLocaleString()}`;
    
    return summary;
  };

  const handleDelete = () => {
    onDelete(model.id);
    onBack();
  };

  const handleExportModel = async () => {
    if (!loadedModel) {
      toast.error('Model not loaded');
      return;
    }

<<<<<<< HEAD
    try {
      // In a real application, you would export the model to a file
      // For now, we'll just show a success message
      toast.success('Model export functionality would be implemented here');
    } catch (error) {
      toast.error('Error exporting model');
=======
    setIsExporting(true);
    
    try {
      // Create model configuration object
      const modelConfig = {
        id: model.id,
        name: model.name,
        fileName: model.fileName,
        targetColumn: model.targetColumn,
        featureColumns: model.featureColumns,
        createdAt: model.createdAt,
        accuracy: model.accuracy,
        modelType: model.modelType,
        trainingTime: model.trainingTime,
        epochs: model.epochs,
        learningRate: model.learningRate,
        loss: model.loss,
        validationLoss: model.validationLoss,
        trainingHistory: model.trainingHistory
      };

      // Get model topology and weights
      const modelTopology = loadedModel.toJSON();
      const weights = await loadedModel.getWeights();
      const weightData = weights.map(w => w.dataSync());

      // Create export package
      const exportData = {
        config: modelConfig,
        topology: modelTopology,
        weights: weightData.map((data, index) => ({
          shape: weights[index].shape,
          data: Array.from(data)
        })),
        metadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0',
          framework: 'TensorFlow.js',
          exportedBy: 'Coherent Analytics Platform'
        }
      };

      // Convert to JSON and create download
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${model.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_model_export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Also create a separate weights file for larger models
      const weightsBlob = new Blob([JSON.stringify(weightData.map((data, index) => ({
        shape: weights[index].shape,
        data: Array.from(data)
      })), null, 2)], { type: 'application/json' });
      const weightsUrl = URL.createObjectURL(weightsBlob);
      
      const weightsLink = document.createElement('a');
      weightsLink.href = weightsUrl;
      weightsLink.download = `${model.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_weights.json`;
      document.body.appendChild(weightsLink);
      weightsLink.click();
      document.body.removeChild(weightsLink);
      URL.revokeObjectURL(weightsUrl);

      toast.success('Model exported successfully! Two files downloaded: model configuration and weights.');
    } catch (error) {
      console.error('Error exporting model:', error);
      toast.error('Error exporting model. Please try again.');
    } finally {
      setIsExporting(false);
>>>>>>> 97bfcc7 (Added the team functionality)
    }
  };

  // Generate mock training history if not available
  const getTrainingHistory = () => {
    if (model.trainingHistory) {
      return model.trainingHistory;
    }
    
    // Generate mock data for demonstration
    const epochs = model.epochs || 50;
    const history = [];
    let loss = 1.0;
    let valLoss = 1.2;
    
    for (let i = 0; i < epochs; i++) {
      loss = Math.max(0.1, loss * (0.95 + Math.random() * 0.1));
      valLoss = Math.max(0.1, valLoss * (0.96 + Math.random() * 0.08));
      
      history.push({
        epoch: i + 1,
        loss: Number(loss.toFixed(4)),
        val_loss: Number(valLoss.toFixed(4))
      });
    }
    
    return history;
  };

  const trainingHistory = getTrainingHistory();

  return (
<<<<<<< HEAD
    <div className="pt-16 min-h-screen bg-gray-50">
=======
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
>>>>>>> 97bfcc7 (Added the team functionality)
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
<<<<<<< HEAD
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
=======
              className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
>>>>>>> 97bfcc7 (Added the team functionality)
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div>
<<<<<<< HEAD
              <h1 className="text-3xl font-bold text-gray-800">{model.name}</h1>
              <p className="text-gray-600">Model Insights & Performance</p>
=======
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{model.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">Model Insights & Performance</p>
>>>>>>> 97bfcc7 (Added the team functionality)
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => onPredict(model)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Play size={20} />
              Make Prediction
            </button>
            <button
              onClick={handleExportModel}
<<<<<<< HEAD
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={20} />
              Export Model
=======
              disabled={isExporting || !loadedModel}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={20} />
              {isExporting ? 'Exporting...' : 'Export Model'}
>>>>>>> 97bfcc7 (Added the team functionality)
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>

        {/* AI Insights Section */}
<<<<<<< HEAD
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-purple-600" size={24} />
            <h3 className="text-xl font-semibold">AI-Generated Model Insights</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Powered by Gemini AI</span>
=======
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-green-600 dark:text-green-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI-Generated Model Insights</h3>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">Powered by Gemini AI</span>
>>>>>>> 97bfcc7 (Added the team functionality)
          </div>
          
          {isGeneratingInsights ? (
            <div className="flex items-center gap-2">
<<<<<<< HEAD
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-gray-600">Generating AI insights...</span>
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiInsights}</div>
=======
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              <span className="text-gray-600 dark:text-gray-300">Generating AI insights...</span>
            </div>
          ) : (
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{aiInsights}</div>
>>>>>>> 97bfcc7 (Added the team functionality)
          )}
        </div>

        {/* Model Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<<<<<<< HEAD
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Model Type</h3>
              <Brain className="text-purple-500" size={24} />
            </div>
            <p className="text-2xl font-bold">{model.modelType}</p>
            <p className="text-sm text-gray-600 mt-1">Deep Learning</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Accuracy</h3>
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold">
              {model.accuracy ? `${(model.accuracy * 100).toFixed(1)}%` : 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mt-1">R² Score</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Training Time</h3>
              <Clock className="text-blue-500" size={24} />
            </div>
            <p className="text-2xl font-bold">
              {model.trainingTime ? `${model.trainingTime}s` : '~30s'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Estimated</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Status</h3>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-green-600">Ready</p>
            <p className="text-sm text-gray-600 mt-1">Available for predictions</p>
=======
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Model Type</h3>
              <Brain className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{model.modelType}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Deep Learning</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Accuracy</h3>
              <TrendingUp className="text-yellow-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {model.accuracy ? `${(model.accuracy * 100).toFixed(1)}%` : 'N/A'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">R² Score</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Training Time</h3>
              <Clock className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {model.trainingTime ? `${model.trainingTime}s` : '~30s'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Estimated</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Status</h3>
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">Ready</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Available for predictions</p>
>>>>>>> 97bfcc7 (Added the team functionality)
          </div>
        </div>

        {/* Model Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
<<<<<<< HEAD
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="text-gray-600" size={24} />
              <h3 className="text-xl font-semibold">Model Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Dataset</span>
                <span className="text-gray-600">{model.fileName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Target Variable</span>
                <span className="text-gray-600 flex items-center gap-1">
=======
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="text-gray-600 dark:text-gray-400" size={24} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Model Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Dataset</span>
                <span className="text-gray-600 dark:text-gray-400">{model.fileName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Target Variable</span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                  <Target size={16} />
                  {model.targetColumn}
                </span>
              </div>
              
<<<<<<< HEAD
              <div className="py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Feature Variables</span>
=======
              <div className="py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Feature Variables</span>
>>>>>>> 97bfcc7 (Added the team functionality)
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.featureColumns.map((feature, index) => (
                    <span 
                      key={index}
<<<<<<< HEAD
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
=======
                      className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-sm"
>>>>>>> 97bfcc7 (Added the team functionality)
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
<<<<<<< HEAD
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Training Epochs</span>
                <span className="text-gray-600">{model.epochs || 50}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Learning Rate</span>
                <span className="text-gray-600">{model.learningRate || 0.001}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">Created</span>
                <span className="text-gray-600">
=======
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Training Epochs</span>
                <span className="text-gray-600 dark:text-gray-400">{model.epochs || 50}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">Learning Rate</span>
                <span className="text-gray-600 dark:text-gray-400">{model.learningRate || 0.001}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Created</span>
                <span className="text-gray-600 dark:text-gray-400">
>>>>>>> 97bfcc7 (Added the team functionality)
                  {new Date(model.createdAt).toLocaleDateString()} at{' '}
                  {new Date(model.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-gray-600" size={24} />
              <h3 className="text-xl font-semibold">Model Architecture</h3>
=======
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-gray-600 dark:text-gray-400" size={24} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Model Architecture</h3>
>>>>>>> 97bfcc7 (Added the team functionality)
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
<<<<<<< HEAD
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
=======
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
>>>>>>> 97bfcc7 (Added the team functionality)
                  {modelSummary || 'Model architecture details loading...'}
                </pre>
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Training History */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-gray-600" size={24} />
            <h3 className="text-xl font-semibold">Training History</h3>
=======
        {/* Export Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Download className="text-gray-600 dark:text-gray-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Model Export</h3>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Export Information</h4>
            <p className="text-yellow-700 dark:text-yellow-200 text-sm mb-3">
              Exporting this model will download two files:
            </p>
            <ul className="text-yellow-700 dark:text-yellow-200 text-sm space-y-1 mb-3">
              <li>• <strong>Model Configuration:</strong> Contains model architecture, training parameters, and metadata</li>
              <li>• <strong>Model Weights:</strong> Contains the trained neural network weights and biases</li>
            </ul>
            <p className="text-yellow-700 dark:text-yellow-200 text-sm">
              These files can be used to recreate and deploy your model in other TensorFlow.js environments.
            </p>
          </div>
        </div>

        {/* Training History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-gray-600 dark:text-gray-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Training History</h3>
>>>>>>> 97bfcc7 (Added the team functionality)
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Loss Chart */}
            <div>
<<<<<<< HEAD
              <h4 className="font-medium mb-4">Training & Validation Loss</h4>
=======
              <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Training & Validation Loss</h4>
>>>>>>> 97bfcc7 (Added the team functionality)
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="loss" 
<<<<<<< HEAD
                      stroke="#3B82F6" 
=======
                      stroke="#16a34a" 
>>>>>>> 97bfcc7 (Added the team functionality)
                      strokeWidth={2}
                      name="Training Loss"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="val_loss" 
<<<<<<< HEAD
                      stroke="#EF4444" 
=======
                      stroke="#d97706" 
>>>>>>> 97bfcc7 (Added the team functionality)
                      strokeWidth={2}
                      name="Validation Loss"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
<<<<<<< HEAD
              <h4 className="font-medium mb-4">Performance Metrics</h4>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="font-medium text-green-800">Final Training Loss</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800">
=======
              <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Performance Metrics</h4>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                    <span className="font-medium text-green-800 dark:text-green-300">Final Training Loss</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-300">
>>>>>>> 97bfcc7 (Added the team functionality)
                    {trainingHistory[trainingHistory.length - 1]?.loss.toFixed(4) || 'N/A'}
                  </p>
                </div>
                
<<<<<<< HEAD
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="text-blue-600" size={20} />
                    <span className="font-medium text-blue-800">Final Validation Loss</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">
=======
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="text-yellow-600 dark:text-yellow-400" size={20} />
                    <span className="font-medium text-yellow-800 dark:text-yellow-300">Final Validation Loss</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
>>>>>>> 97bfcc7 (Added the team functionality)
                    {trainingHistory[trainingHistory.length - 1]?.val_loss?.toFixed(4) || 'N/A'}
                  </p>
                </div>
                
<<<<<<< HEAD
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-purple-600" size={20} />
                    <span className="font-medium text-purple-800">Model Convergence</span>
                  </div>
                  <p className="text-lg font-bold text-purple-800">
=======
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                    <span className="font-medium text-green-800 dark:text-green-300">Model Convergence</span>
                  </div>
                  <p className="text-lg font-bold text-green-800 dark:text-green-300">
>>>>>>> 97bfcc7 (Added the team functionality)
                    {trainingHistory.length > 10 ? 'Good' : 'Needs More Training'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Details */}
<<<<<<< HEAD
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-gray-600" size={24} />
            <h3 className="text-xl font-semibold">Algorithm Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Algorithm Type</h4>
              <p className="text-gray-700">Deep Neural Network</p>
              <p className="text-sm text-gray-600 mt-1">
=======
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-gray-600 dark:text-gray-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Algorithm Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Algorithm Type</h4>
              <p className="text-gray-700 dark:text-gray-300">Deep Neural Network</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                Multi-layer perceptron with ReLU activation functions
              </p>
            </div>
            
<<<<<<< HEAD
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Optimizer</h4>
              <p className="text-gray-700">Adam</p>
              <p className="text-sm text-gray-600 mt-1">
=======
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Optimizer</h4>
              <p className="text-gray-700 dark:text-gray-300">Adam</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                Adaptive learning rate optimization algorithm
              </p>
            </div>
            
<<<<<<< HEAD
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Loss Function</h4>
              <p className="text-gray-700">Mean Squared Error</p>
              <p className="text-sm text-gray-600 mt-1">
=======
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Loss Function</h4>
              <p className="text-gray-700 dark:text-gray-300">Mean Squared Error</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                Suitable for regression problems
              </p>
            </div>
            
<<<<<<< HEAD
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Validation Split</h4>
              <p className="text-gray-700">20%</p>
              <p className="text-sm text-gray-600 mt-1">
=======
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Validation Split</h4>
              <p className="text-gray-700 dark:text-gray-300">20%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                Data reserved for validation during training
              </p>
            </div>
            
<<<<<<< HEAD
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Batch Processing</h4>
              <p className="text-gray-700">Full Dataset</p>
              <p className="text-sm text-gray-600 mt-1">
=======
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Batch Processing</h4>
              <p className="text-gray-700 dark:text-gray-300">Full Dataset</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                All training data processed in each epoch
              </p>
            </div>
            
<<<<<<< HEAD
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Framework</h4>
              <p className="text-gray-700">TensorFlow.js</p>
              <p className="text-sm text-gray-600 mt-1">
=======
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Framework</h4>
              <p className="text-gray-700 dark:text-gray-300">TensorFlow.js</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                Client-side machine learning library
              </p>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-600" size={24} />
                <h3 className="text-xl font-bold">Delete Model</h3>
              </div>
              
              <p className="text-gray-700 mb-6">
=======
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Model</h3>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
>>>>>>> 97bfcc7 (Added the team functionality)
                Are you sure you want to delete the model "{model.name}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
<<<<<<< HEAD
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
=======
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
>>>>>>> 97bfcc7 (Added the team functionality)
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Delete Model
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelInsights;