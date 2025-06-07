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
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
      throw new Error('Failed to generate AI description. Please try again.');
    }
  }

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
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
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