import React, { useState, useEffect } from 'react';
import { read, utils } from 'xlsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  Table, 
  BarChart2, 
  LineChart as LineIcon, 
  PieChart as PieIcon, 
  ArrowLeft, 
  Brain, 
  Play,
  FileText,
  Database,
  TrendingUp,
  Hash,
  Type,
  Calendar,
  Eye,
  Save,
  Target,
  Zap,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as tf from '@tensorflow/tfjs';
import { geminiAI } from '../lib/gemini';

interface DatasetViewProps {
  file: File;
  onBack: () => void;
  selectedModel?: SavedModel | null;
  onModelSaved?: (model: SavedModel) => void;
}

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

interface DatasetStats {
  totalRows: number;
  totalColumns: number;
  numericColumns: number;
  textColumns: number;
  dateColumns: number;
  missingValues: number;
  duplicateRows: number;
}

interface ColumnStats {
  name: string;
  type: 'numeric' | 'text' | 'date';
  uniqueValues: number;
  missingCount: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  mode?: string | number;
}

<<<<<<< HEAD
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
=======
const COLORS = ['#16a34a', '#22c55e', '#d97706', '#f59e0b', '#4ade80', '#fbbf24', '#86efac'];
>>>>>>> 97bfcc7 (Added the team functionality)

const DatasetView: React.FC<DatasetViewProps> = ({ file, onBack, selectedModel, onModelSaved }) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedChart, setSelectedChart] = useState<'stats' | 'table' | 'bar' | 'line' | 'pie' | 'scatter'>('stats');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [featureColumns, setFeatureColumns] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainedModel, setTrainedModel] = useState<tf.LayersModel | null>(null);
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [predictionInputs, setPredictionInputs] = useState<Record<string, number>>({});
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [datasetStats, setDatasetStats] = useState<DatasetStats | null>(null);
  const [columnStats, setColumnStats] = useState<ColumnStats[]>([]);
  const [aiDescription, setAiDescription] = useState<string>('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [modelName, setModelName] = useState<string>('');
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    const readFile = async () => {
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      
      if (jsonData.length > 0) {
        setData(jsonData);
        const cols = Object.keys(jsonData[0]);
        setColumns(cols);
        
        const numericColumns = cols.filter(
          key => !isNaN(Number(jsonData[0][key]))
        );
        setSelectedColumns([
          numericColumns[0] || cols[0],
          numericColumns[1] || cols[1]
        ]);

        // Calculate dataset statistics
        calculateDatasetStats(jsonData, cols);
        generateAIDescription(jsonData, cols);
      }
    };

    readFile();
  }, [file]);

  const calculateDatasetStats = (data: any[], columns: string[]) => {
    const stats: DatasetStats = {
      totalRows: data.length,
      totalColumns: columns.length,
      numericColumns: 0,
      textColumns: 0,
      dateColumns: 0,
      missingValues: 0,
      duplicateRows: 0
    };

    const columnStatsArray: ColumnStats[] = [];

    // Calculate column-specific stats
    columns.forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      const nonEmptyValues = values.length;
      const missingCount = data.length - nonEmptyValues;
      stats.missingValues += missingCount;

      const uniqueValues = new Set(values).size;
      
      // Determine column type
      const isNumeric = values.every(val => !isNaN(Number(val)));
      const isDate = values.some(val => !isNaN(Date.parse(val)));
      
      let columnType: 'numeric' | 'text' | 'date' = 'text';
      if (isNumeric) {
        columnType = 'numeric';
        stats.numericColumns++;
      } else if (isDate) {
        columnType = 'date';
        stats.dateColumns++;
      } else {
        stats.textColumns++;
      }

      const columnStat: ColumnStats = {
        name: column,
        type: columnType,
        uniqueValues,
        missingCount
      };

      if (columnType === 'numeric') {
        const numericValues = values.map(val => Number(val));
        columnStat.min = Math.min(...numericValues);
        columnStat.max = Math.max(...numericValues);
        columnStat.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
        
        const sorted = [...numericValues].sort((a, b) => a - b);
        columnStat.median = sorted.length % 2 === 0 
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
      }

      // Calculate mode
      const frequency: Record<string, number> = {};
      values.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1;
      });
      const mode = Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
      columnStat.mode = columnType === 'numeric' ? Number(mode) : mode;

      columnStatsArray.push(columnStat);
    });

    // Calculate duplicate rows
    const uniqueRows = new Set(data.map(row => JSON.stringify(row)));
    stats.duplicateRows = data.length - uniqueRows.size;

    setDatasetStats(stats);
    setColumnStats(columnStatsArray);
  };

  const generateAIDescription = async (data: any[], columns: string[]) => {
    setIsGeneratingDescription(true);
    
    try {
      // Prepare dataset summary for Gemini AI
      const numericCols = columns.filter(col => 
        data.every(row => !isNaN(Number(row[col])))
      );
      
      const textCols = columns.filter(col => 
        !data.every(row => !isNaN(Number(row[col])))
      );

      const dateCols = columns.filter(col => 
        data.some(row => !isNaN(Date.parse(row[col])))
      );

      const columnTypes: Record<string, string> = {};
      columns.forEach(col => {
        if (numericCols.includes(col)) {
          columnTypes[col] = 'numeric';
        } else if (dateCols.includes(col)) {
          columnTypes[col] = 'date';
        } else {
          columnTypes[col] = 'text/categorical';
        }
      });

      const datasetSummary = {
        totalRows: data.length,
        totalColumns: columns.length,
        numericColumns: numericCols,
        textColumns: textCols,
        dateColumns: dateCols,
        sampleData: data.slice(0, 3),
        columnTypes
      };

      const description = await geminiAI.generateDatasetDescription(datasetSummary, file.name);
      setAiDescription(description);
    } catch (error) {
      console.error('Error generating AI description:', error);
      
      // Fallback to the original template-based description
      const numericCols = columns.filter(col => 
        data.every(row => !isNaN(Number(row[col])))
      );
      
      const textCols = columns.filter(col => 
        !data.every(row => !isNaN(Number(row[col])))
      );

      let description = `This dataset contains ${data.length} records with ${columns.length} features. `;
      
      if (numericCols.length > 0) {
        description += `It includes ${numericCols.length} numeric columns (${numericCols.slice(0, 3).join(', ')}${numericCols.length > 3 ? '...' : ''}) `;
      }
      
      if (textCols.length > 0) {
        description += `and ${textCols.length} categorical/text columns (${textCols.slice(0, 3).join(', ')}${textCols.length > 3 ? '...' : ''}). `;
      }

      description += `The dataset appears to be suitable for `;
      
      if (numericCols.length >= 2) {
        description += `regression analysis, correlation studies, and predictive modeling. `;
      }
      
      if (textCols.length > 0) {
        description += `classification tasks and categorical analysis. `;
      }

      description += `Key insights could be derived through statistical analysis and machine learning techniques.`;

      setAiDescription(description);
      toast.error('AI description generation failed. Using fallback analysis.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const getNumericColumns = () => {
    return columns.filter(column => 
      data.every(row => !isNaN(Number(row[column])))
    );
  };

  const renderStatsView = () => {
    if (!datasetStats) return null;

    return (
      <div className="space-y-6">
        {/* Dataset Overview */}
<<<<<<< HEAD
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-blue-600" size={24} />
            <h3 className="text-xl font-semibold">Dataset Overview</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-medium">Total Rows</span>
                <Database className="text-blue-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-blue-800">{datasetStats.totalRows.toLocaleString()}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-medium">Columns</span>
                <Hash className="text-green-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-green-800">{datasetStats.totalColumns}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-medium">File Size</span>
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-purple-800">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-orange-600 font-medium">Missing Values</span>
                <Type className="text-orange-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-orange-800">{datasetStats.missingValues}</p>
=======
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-green-600" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Dataset Overview</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-600 dark:text-green-400 font-medium">Total Rows</span>
                <Database className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{datasetStats.totalRows.toLocaleString()}</p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">Columns</span>
                <Hash className="text-yellow-600 dark:text-yellow-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{datasetStats.totalColumns}</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-600 dark:text-green-400 font-medium">File Size</span>
                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">Missing Values</span>
                <Type className="text-yellow-600 dark:text-yellow-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{datasetStats.missingValues}</p>
>>>>>>> 97bfcc7 (Added the team functionality)
            </div>
          </div>

          {/* AI Description */}
<<<<<<< HEAD
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="text-purple-600" size={20} />
              AI-Generated Analysis
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Powered by Gemini AI</span>
            </h4>
            {isGeneratingDescription ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-gray-600">Analyzing dataset with AI...</span>
              </div>
            ) : (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiDescription}</div>
=======
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
              <Sparkles className="text-green-600 dark:text-green-400" size={20} />
              AI-Generated Analysis
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">Powered by Gemini AI</span>
            </h4>
            {isGeneratingDescription ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                <span className="text-gray-600 dark:text-gray-300">Analyzing dataset with AI...</span>
              </div>
            ) : (
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{aiDescription}</div>
>>>>>>> 97bfcc7 (Added the team functionality)
            )}
          </div>
        </div>

        {/* Column Types Distribution */}
<<<<<<< HEAD
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Column Types Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Hash className="mx-auto text-blue-600 mb-2" size={32} />
              <p className="text-2xl font-bold text-blue-800">{datasetStats.numericColumns}</p>
              <p className="text-blue-600">Numeric</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Type className="mx-auto text-green-600 mb-2" size={32} />
              <p className="text-2xl font-bold text-green-800">{datasetStats.textColumns}</p>
              <p className="text-green-600">Text/Categorical</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="mx-auto text-purple-600 mb-2" size={32} />
              <p className="text-2xl font-bold text-purple-800">{datasetStats.dateColumns}</p>
              <p className="text-purple-600">Date/Time</p>
=======
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Column Types Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Hash className="mx-auto text-green-600 dark:text-green-400 mb-2" size={32} />
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{datasetStats.numericColumns}</p>
              <p className="text-green-600 dark:text-green-400">Numeric</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Type className="mx-auto text-yellow-600 dark:text-yellow-400 mb-2" size={32} />
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{datasetStats.textColumns}</p>
              <p className="text-yellow-600 dark:text-yellow-400">Text/Categorical</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Calendar className="mx-auto text-green-600 dark:text-green-400 mb-2" size={32} />
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{datasetStats.dateColumns}</p>
              <p className="text-green-600 dark:text-green-400">Date/Time</p>
>>>>>>> 97bfcc7 (Added the team functionality)
            </div>
          </div>
        </div>

        {/* Column Statistics */}
<<<<<<< HEAD
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Column Statistics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Values</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {columnStats.map((stat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        stat.type === 'numeric' ? 'bg-blue-100 text-blue-800' :
                        stat.type === 'date' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
=======
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Column Statistics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Column</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unique Values</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Missing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Min</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Max</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mean</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {columnStats.map((stat, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{stat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        stat.type === 'numeric' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        stat.type === 'date' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
>>>>>>> 97bfcc7 (Added the team functionality)
                      }`}>
                        {stat.type}
                      </span>
                    </td>
<<<<<<< HEAD
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.uniqueValues}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.missingCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.min !== undefined ? stat.min.toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.max !== undefined ? stat.max.toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
=======
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{stat.uniqueValues}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{stat.missingCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {stat.min !== undefined ? stat.min.toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {stat.max !== undefined ? stat.max.toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
>>>>>>> 97bfcc7 (Added the team functionality)
                      {stat.mean !== undefined ? stat.mean.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Visualizations */}
        {getNumericColumns().length >= 2 && (
<<<<<<< HEAD
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Correlation Visualization</h3>
=======
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Correlation Visualization</h3>
>>>>>>> 97bfcc7 (Added the team functionality)
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={data.slice(0, 100)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={getNumericColumns()[0]} />
                  <YAxis dataKey={getNumericColumns()[1]} />
                  <Tooltip />
<<<<<<< HEAD
                  <Scatter dataKey={getNumericColumns()[1]} fill="#8884d8" />
=======
                  <Scatter dataKey={getNumericColumns()[1]} fill="#16a34a" />
>>>>>>> 97bfcc7 (Added the team functionality)
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCreateModel = async () => {
    if (!targetColumn || featureColumns.length === 0) {
      toast.error('Please select target and feature columns');
      return;
    }

    setIsTraining(true);
    try {
      // Prepare the data
      const X = data.map(row => featureColumns.map(col => Number(row[col])));
      const y = data.map(row => Number(row[targetColumn]));

      // Create and normalize tensors
      const xTensor = tf.tensor2d(X);
      const yTensor = tf.tensor1d(y);

      // Create the model
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [featureColumns.length], units: 64, activation: 'relu' }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dense({ units: 1 })
        ]
      });

      // Compile the model
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['mse']
      });

      // Train the model
      const history = await model.fit(xTensor, yTensor, {
        epochs: 50,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss?.toFixed(4)}`);
          }
        }
      });

      // Calculate accuracy (for regression, we'll use R² score approximation)
      const predictions = model.predict(xTensor) as tf.Tensor;
      const predValues = await predictions.data();
      const actualValues = await yTensor.data();
      
      // Calculate R² score
      const meanActual = actualValues.reduce((a, b) => a + b, 0) / actualValues.length;
      const totalSumSquares = actualValues.reduce((sum, val) => sum + Math.pow(val - meanActual, 2), 0);
      const residualSumSquares = actualValues.reduce((sum, val, i) => sum + Math.pow(val - predValues[i], 2), 0);
      const rSquared = 1 - (residualSumSquares / totalSumSquares);

      // Save the model
      setTrainedModel(model);
      setModelAccuracy(Math.max(0, rSquared)); // Ensure non-negative
      
      toast.success('Model training completed!');
      setShowModelDialog(false);
      setShowSaveDialog(true);
    } catch (error) {
      console.error('Error training model:', error);
      toast.error('Error training model. Please check the console for details.');
    } finally {
      setIsTraining(false);
    }
  };

  const handleSaveModel = async () => {
    if (!trainedModel || !modelName.trim()) {
      toast.error('Please enter a model name');
      return;
    }

    try {
      const modelId = Date.now().toString();
      
      // Save model to localStorage (in a real app, you'd save to a backend)
      await trainedModel.save(`localstorage://model_${modelId}`);
      
      const savedModel: SavedModel = {
        id: modelId,
        name: modelName.trim(),
        fileName: file.name,
        targetColumn,
        featureColumns,
        createdAt: new Date().toISOString(),
        accuracy: modelAccuracy || undefined,
        modelType: 'Neural Network'
      };

      if (onModelSaved) {
        onModelSaved(savedModel);
      }

      toast.success('Model saved successfully!');
      setShowSaveDialog(false);
      setModelName('');
    } catch (error) {
      console.error('Error saving model:', error);
      toast.error('Error saving model');
    }
  };

  const handlePredict = async () => {
    let modelToUse = trainedModel;

    // If no trained model but we have a selected model, load it
    if (!modelToUse && selectedModel) {
      try {
        modelToUse = await tf.loadLayersModel(`localstorage://model_${selectedModel.id}`);
        setTrainedModel(modelToUse);
      } catch (error) {
        toast.error('Error loading selected model');
        return;
      }
    }

    if (!modelToUse) {
      toast.error('No model available for prediction');
      return;
    }

    try {
      const columnsToUse = selectedModel ? selectedModel.featureColumns : featureColumns;
      const inputArray = columnsToUse.map(col => Number(predictionInputs[col]));
      const inputTensor = tf.tensor2d([inputArray]);
      
      const prediction = await modelToUse.predict(inputTensor) as tf.Tensor;
      const result = (await prediction.data())[0];
      
      setPredictionResult(Number(result.toFixed(2)));
      toast.success('Prediction completed!');
    } catch (error) {
      console.error('Error making prediction:', error);
      toast.error('Error making prediction. Please check your inputs.');
    }
  };

  const renderTable = () => (
    <div className="overflow-x-auto max-h-[600px]">
<<<<<<< HEAD
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
=======
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
>>>>>>> 97bfcc7 (Added the team functionality)
          <tr>
            {columns.map((column) => (
              <th
                key={column}
<<<<<<< HEAD
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
=======
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
>>>>>>> 97bfcc7 (Added the team functionality)
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
<<<<<<< HEAD
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(0, 100).map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
=======
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.slice(0, 100).map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
>>>>>>> 97bfcc7 (Added the team functionality)
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const prepareChartData = () => {
    return data
      .slice(0, 10)
      .map(row => ({
        name: String(row[selectedColumns[0]]),
        value: Number(row[selectedColumns[1]]) || 0
      }))
      .filter(item => !isNaN(item.value));
  };

  const renderChart = () => {
    const chartData = prepareChartData();

    if (chartData.length === 0) {
      return (
<<<<<<< HEAD
        <div className="flex items-center justify-center h-[500px] text-gray-500">
=======
        <div className="flex items-center justify-center h-[500px] text-gray-500 dark:text-gray-400">
>>>>>>> 97bfcc7 (Added the team functionality)
          No valid numeric data available for the selected columns
        </div>
      );
    }

    switch (selectedChart) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
<<<<<<< HEAD
              <Bar dataKey="value" fill="#8884d8" name={selectedColumns[1]} />
=======
              <Bar dataKey="value" fill="#16a34a" name={selectedColumns[1]} />
>>>>>>> 97bfcc7 (Added the team functionality)
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
<<<<<<< HEAD
                stroke="#8884d8" 
=======
                stroke="#16a34a" 
>>>>>>> 97bfcc7 (Added the team functionality)
                name={selectedColumns[1]}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
<<<<<<< HEAD
                fill="#8884d8"
=======
                fill="#16a34a"
>>>>>>> 97bfcc7 (Added the team functionality)
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart data={data.slice(0, 100)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedColumns[0]} />
              <YAxis dataKey={selectedColumns[1]} />
              <Tooltip />
<<<<<<< HEAD
              <Scatter dataKey={selectedColumns[1]} fill="#8884d8" />
=======
              <Scatter dataKey={selectedColumns[1]} fill="#16a34a" />
>>>>>>> 97bfcc7 (Added the team functionality)
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
<<<<<<< HEAD
    <div className="pt-16 min-h-screen bg-gray-50">
=======
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
>>>>>>> 97bfcc7 (Added the team functionality)
      <div className="container mx-auto px-4 py-8">
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
              Back to Files
            </button>
<<<<<<< HEAD
            <h2 className="text-2xl font-bold text-gray-800">{file.name}</h2>
          </div>
          <div className="flex gap-4">
            {selectedModel && (
              <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-2 rounded-lg">
=======
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{file.name}</h2>
          </div>
          <div className="flex gap-4">
            {selectedModel && (
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-2 rounded-lg">
>>>>>>> 97bfcc7 (Added the team functionality)
                <Target size={16} />
                <span className="text-sm font-medium">Using: {selectedModel.name}</span>
              </div>
            )}
            <button
              onClick={() => setShowModelDialog(true)}
<<<<<<< HEAD
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
=======
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
>>>>>>> 97bfcc7 (Added the team functionality)
            >
              <Brain size={20} />
              Create Model
            </button>
            {(trainedModel || selectedModel) && (
              <button
                onClick={() => setShowPredictionDialog(true)}
<<<<<<< HEAD
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
=======
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
>>>>>>> 97bfcc7 (Added the team functionality)
              >
                <Play size={20} />
                Make Prediction
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedChart('stats')}
                className={`p-2 rounded ${
<<<<<<< HEAD
                  selectedChart === 'stats' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
=======
                  selectedChart === 'stats' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
>>>>>>> 97bfcc7 (Added the team functionality)
                }`}
                title="Dataset Statistics"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => setSelectedChart('table')}
                className={`p-2 rounded ${
<<<<<<< HEAD
                  selectedChart === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
=======
                  selectedChart === 'table' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
>>>>>>> 97bfcc7 (Added the team functionality)
                }`}
                title="Table View"
              >
                <Table size={20} />
              </button>
              <button
                onClick={() => setSelectedChart('bar')}
                className={`p-2 rounded ${
<<<<<<< HEAD
                  selectedChart === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
=======
                  selectedChart === 'bar' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
>>>>>>> 97bfcc7 (Added the team functionality)
                }`}
                title="Bar Chart"
              >
                <BarChart2 size={20} />
              </button>
              <button
                onClick={() => setSelectedChart('line')}
                className={`p-2 rounded ${
<<<<<<< HEAD
                  selectedChart === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
=======
                  selectedChart === 'line' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
>>>>>>> 97bfcc7 (Added the team functionality)
                }`}
                title="Line Chart"
              >
                <LineIcon size={20} />
              </button>
              <button
                onClick={() => setSelectedChart('pie')}
                className={`p-2 rounded ${
<<<<<<< HEAD
                  selectedChart === 'pie' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
=======
                  selectedChart === 'pie' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
>>>>>>> 97bfcc7 (Added the team functionality)
                }`}
                title="Pie Chart"
              >
                <PieIcon size={20} />
              </button>
              <button
                onClick={() => setSelectedChart('scatter')}
                className={`p-2 rounded ${
<<<<<<< HEAD
                  selectedChart === 'scatter' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
=======
                  selectedChart === 'scatter' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
>>>>>>> 97bfcc7 (Added the team functionality)
                }`}
                title="Scatter Plot"
              >
                <Zap size={20} />
              </button>
            </div>
          </div>
        </div>

        {selectedChart !== 'table' && selectedChart !== 'stats' && (
          <div className="mb-6 flex gap-4">
            <div>
<<<<<<< HEAD
              <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
              <select
                value={selectedColumns[0]}
                onChange={(e) => setSelectedColumns([e.target.value, selectedColumns[1]])}
                className="border rounded-lg px-3 py-2"
=======
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">X-Axis</label>
              <select
                value={selectedColumns[0]}
                onChange={(e) => setSelectedColumns([e.target.value, selectedColumns[1]])}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
              >
                {columns.map(column => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>
            </div>
            <div>
<<<<<<< HEAD
              <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
              <select
                value={selectedColumns[1]}
                onChange={(e) => setSelectedColumns([selectedColumns[0], e.target.value])}
                className="border rounded-lg px-3 py-2"
=======
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Y-Axis</label>
              <select
                value={selectedColumns[1]}
                onChange={(e) => setSelectedColumns([selectedColumns[0], e.target.value])}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
              >
                {columns.map(column => (
                  <option key={column} value={column}>{column}</option>
                ))}
              </select>
            </div>
          </div>
        )}

<<<<<<< HEAD
        <div className="bg-white rounded-xl shadow-md p-6">
=======
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
>>>>>>> 97bfcc7 (Added the team functionality)
          {selectedChart === 'stats' ? renderStatsView() : 
           selectedChart === 'table' ? renderTable() : renderChart()}
        </div>

        {/* Model Creation Dialog */}
        {showModelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Create Machine Learning Model</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
=======
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Machine Learning Model</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                  Select Target Column (What to Predict)
                </label>
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
<<<<<<< HEAD
                  className="w-full border rounded-lg px-3 py-2"
=======
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
                >
                  <option value="">Select column...</option>
                  {getNumericColumns().map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
<<<<<<< HEAD
                <label className="block text-sm font-medium text-gray-700 mb-1">
=======
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                  Select Feature Columns (Input Data)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {getNumericColumns()
                    .filter(col => col !== targetColumn)
                    .map(column => (
                      <label key={column} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={featureColumns.includes(column)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFeatureColumns([...featureColumns, column]);
                            } else {
                              setFeatureColumns(featureColumns.filter(col => col !== column));
                            }
                          }}
                          className="mr-2"
                        />
<<<<<<< HEAD
                        {column}
=======
                        <span className="text-gray-900 dark:text-white">{column}</span>
>>>>>>> 97bfcc7 (Added the team functionality)
                      </label>
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModelDialog(false)}
<<<<<<< HEAD
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
=======
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
>>>>>>> 97bfcc7 (Added the team functionality)
                  disabled={isTraining}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateModel}
                  disabled={isTraining || !targetColumn || featureColumns.length === 0}
<<<<<<< HEAD
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
=======
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
>>>>>>> 97bfcc7 (Added the team functionality)
                >
                  {isTraining ? 'Training...' : 'Train Model'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Model Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
=======
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
>>>>>>> 97bfcc7 (Added the team functionality)
                <Save className="text-green-600" size={24} />
                Save Trained Model
              </h3>
              
              <div className="mb-4">
<<<<<<< HEAD
                <label className="block text-sm font-medium text-gray-700 mb-1">
=======
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                  Model Name
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
<<<<<<< HEAD
                  className="w-full border rounded-lg px-3 py-2"
=======
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
                  placeholder="Enter a name for your model"
                />
              </div>

<<<<<<< HEAD
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Model Details:</h4>
                <p className="text-sm text-gray-600">Target: {targetColumn}</p>
                <p className="text-sm text-gray-600">Features: {featureColumns.join(', ')}</p>
                {modelAccuracy && (
                  <p className="text-sm text-gray-600">
=======
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Model Details:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Target: {targetColumn}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Features: {featureColumns.join(', ')}</p>
                {modelAccuracy && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
>>>>>>> 97bfcc7 (Added the team functionality)
                    Accuracy: {(modelAccuracy * 100).toFixed(1)}%
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowSaveDialog(false)}
<<<<<<< HEAD
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
=======
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
>>>>>>> 97bfcc7 (Added the team functionality)
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModel}
                  disabled={!modelName.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Save Model
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Dialog */}
        {showPredictionDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Make Prediction</h3>
              
              {selectedModel && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">Using model: <strong>{selectedModel.name}</strong></p>
=======
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Make Prediction</h3>
              
              {selectedModel && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">Using model: <strong>{selectedModel.name}</strong></p>
>>>>>>> 97bfcc7 (Added the team functionality)
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                {(selectedModel ? selectedModel.featureColumns : featureColumns).map(column => (
                  <div key={column}>
<<<<<<< HEAD
                    <label className="block text-sm font-medium text-gray-700 mb-1">
=======
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
>>>>>>> 97bfcc7 (Added the team functionality)
                      {column}
                    </label>
                    <input
                      type="number"
                      value={predictionInputs[column] || ''}
                      onChange={(e) => setPredictionInputs({
                        ...predictionInputs,
                        [column]: e.target.value ? Number(e.target.value) : ''
                      })}
<<<<<<< HEAD
                      className="w-full border rounded-lg px-3 py-2"
=======
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
>>>>>>> 97bfcc7 (Added the team functionality)
                      placeholder={`Enter value for ${column}`}
                    />
                  </div>
                ))}
              </div>

              {predictionResult !== null && (
<<<<<<< HEAD
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Predicted {selectedModel ? selectedModel.targetColumn : targetColumn}:</p>
                  <p className="text-2xl font-bold text-purple-600">{predictionResult}</p>
=======
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white">Predicted {selectedModel ? selectedModel.targetColumn : targetColumn}:</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{predictionResult}</p>
>>>>>>> 97bfcc7 (Added the team functionality)
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowPredictionDialog(false);
                    setPredictionResult(null);
                    setPredictionInputs({});
                  }}
<<<<<<< HEAD
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
=======
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
>>>>>>> 97bfcc7 (Added the team functionality)
                >
                  Close
                </button>
                <button
                  onClick={handlePredict}
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

export default DatasetView;