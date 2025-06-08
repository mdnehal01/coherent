interface DatasetSummary {
  totalRows: number;
  totalColumns: number;
  numericColumns: string[];
  textColumns: string[];
  dateColumns: string[];
  sampleData: any[];
  columnTypes: Record<string, string>;
}

export class GeminiAI {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateDatasetDescription(datasetSummary: DatasetSummary, fileName: string): Promise<string> {
<<<<<<< HEAD
=======
    // Check if API key is available
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.warn('Gemini API key not configured. Returning fallback description.');
      return this.generateFallbackDescription(datasetSummary, fileName);
    }

>>>>>>> 97bfcc7 (Added the team functionality)
    try {
      const prompt = this.createDatasetAnalysisPrompt(datasetSummary, fileName);
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
<<<<<<< HEAD
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
=======
        console.error(`Gemini API error: ${response.status} ${response.statusText}`);
        return this.generateFallbackDescription(datasetSummary, fileName);
>>>>>>> 97bfcc7 (Added the team functionality)
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
<<<<<<< HEAD
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
      throw new Error('Failed to generate AI description. Please try again.');
    }
  }

=======
        console.error('Invalid response format from Gemini API');
        return this.generateFallbackDescription(datasetSummary, fileName);
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
      return this.generateFallbackDescription(datasetSummary, fileName);
    }
  }

  private generateFallbackDescription(summary: DatasetSummary, fileName: string): string {
    const { totalRows, totalColumns, numericColumns, textColumns, dateColumns } = summary;
    
    return `
**Dataset Overview: ${fileName}**

This dataset contains ${totalRows.toLocaleString()} rows and ${totalColumns} columns, providing a comprehensive data structure for analysis.

**Data Composition:**
- **Numeric columns (${numericColumns.length}):** ${numericColumns.slice(0, 5).join(', ')}${numericColumns.length > 5 ? '...' : ''}
- **Text/Categorical columns (${textColumns.length}):** ${textColumns.slice(0, 5).join(', ')}${textColumns.length > 5 ? '...' : ''}
- **Date columns (${dateColumns.length}):** ${dateColumns.join(', ') || 'None'}

**Analysis Opportunities:**
This dataset appears suitable for various analytical approaches including statistical analysis, machine learning modeling, and data visualization. The mix of numeric and categorical variables suggests potential for both regression and classification tasks.

**Recommended Next Steps:**
1. Explore data distributions and identify patterns
2. Check for missing values and outliers
3. Consider correlation analysis between numeric variables
4. Evaluate categorical variables for encoding needs

*Note: AI-powered insights are currently unavailable. Please configure your Gemini API key for enhanced analysis.*
    `.trim();
  }

>>>>>>> 97bfcc7 (Added the team functionality)
  private createDatasetAnalysisPrompt(summary: DatasetSummary, fileName: string): string {
    const { totalRows, totalColumns, numericColumns, textColumns, dateColumns, sampleData, columnTypes } = summary;
    
    // Create a sample of the data for analysis
    const sampleDataString = sampleData.slice(0, 3).map(row => 
      Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')
    ).join('\n');

    return `
Analyze this dataset and provide a comprehensive, professional description:

Dataset: ${fileName}
Rows: ${totalRows.toLocaleString()}
Columns: ${totalColumns}

Column Types:
- Numeric columns (${numericColumns.length}): ${numericColumns.slice(0, 5).join(', ')}${numericColumns.length > 5 ? '...' : ''}
- Text/Categorical columns (${textColumns.length}): ${textColumns.slice(0, 5).join(', ')}${textColumns.length > 5 ? '...' : ''}
- Date columns (${dateColumns.length}): ${dateColumns.join(', ')}

Sample Data (first 3 rows):
${sampleDataString}

Column Details:
${Object.entries(columnTypes).slice(0, 10).map(([col, type]) => `- ${col}: ${type}`).join('\n')}

Please provide:
1. A brief overview of what this dataset appears to contain
2. Key insights about the data structure and content
3. Potential use cases and analysis opportunities
4. Recommended machine learning approaches (if applicable)
5. Any data quality observations

Keep the response concise but informative, around 150-200 words. Focus on actionable insights that would help a data analyst understand the dataset's potential.
`;
  }

  async generateModelInsights(modelConfig: any): Promise<string> {
<<<<<<< HEAD
=======
    // Check if API key is available
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.warn('Gemini API key not configured. Returning fallback insights.');
      return this.generateFallbackModelInsights(modelConfig);
    }

>>>>>>> 97bfcc7 (Added the team functionality)
    try {
      const prompt = `
Analyze this machine learning model configuration and provide insights:

Model Type: ${modelConfig.modelType}
Target Variable: ${modelConfig.targetColumn}
Feature Variables: ${modelConfig.featureColumns.join(', ')}
Dataset: ${modelConfig.fileName}
Accuracy: ${modelConfig.accuracy ? (modelConfig.accuracy * 100).toFixed(1) + '%' : 'N/A'}

Please provide:
1. Analysis of the model's purpose and approach
2. Assessment of feature selection
3. Performance evaluation
4. Recommendations for improvement
5. Potential business applications

Keep the response professional and actionable, around 100-150 words.
`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          }
        })
      });

      if (!response.ok) {
<<<<<<< HEAD
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
=======
        console.error(`Gemini API error: ${response.status} ${response.statusText}`);
        return this.generateFallbackModelInsights(modelConfig);
>>>>>>> 97bfcc7 (Added the team functionality)
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
<<<<<<< HEAD
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error generating model insights:', error);
      throw new Error('Failed to generate model insights. Please try again.');
    }
  }
}

// Create a singleton instance
export const geminiAI = new GeminiAI('AIzaSyBJUKjEY4DoIX2-MCxRp-nFV8jqZCa_zbw');
=======
        console.error('Invalid response format from Gemini API');
        return this.generateFallbackModelInsights(modelConfig);
      }
    } catch (error) {
      console.error('Error generating model insights:', error);
      return this.generateFallbackModelInsights(modelConfig);
    }
  }

  private generateFallbackModelInsights(modelConfig: any): string {
    return `
**Model Analysis: ${modelConfig.name}**

**Model Configuration:**
- Type: ${modelConfig.modelType}
- Target: ${modelConfig.targetColumn}
- Features: ${modelConfig.featureColumns.length} variables
- Performance: ${modelConfig.accuracy ? (modelConfig.accuracy * 100).toFixed(1) + '% accuracy' : 'Not evaluated'}

**Key Observations:**
This ${modelConfig.modelType} model uses ${modelConfig.featureColumns.length} feature variables to predict ${modelConfig.targetColumn}. The selected features appear to provide a solid foundation for prediction tasks.

**Recommendations:**
1. Monitor model performance on new data
2. Consider feature engineering for improved accuracy
3. Validate predictions against business requirements
4. Regular retraining may be beneficial

*Note: AI-powered insights are currently unavailable. Please configure your Gemini API key for enhanced analysis.*
    `.trim();
  }
}

// Create a singleton instance using environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY not found in environment variables. Gemini AI features will use fallback descriptions.');
}

export const geminiAI = new GeminiAI(apiKey || '');
>>>>>>> 97bfcc7 (Added the team functionality)
