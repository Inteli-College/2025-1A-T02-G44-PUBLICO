import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Quote } from 'lucide-react';

interface Citation {
  cited_text: string;
  document_index: number;
  document_title: string;
  end_page_number: number;
  start_page_number: number;
  type: string;
}

interface ContentItem {
  citations: Citation[] | null;
  text: string;
  type: string;
}

interface AnalysisData {
  success: boolean;
  content: ContentItem[];
  model_used: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const renderContent = () => {
    return data.content.map((item, index) => {
      // Skip empty text items
      if (!item.text.trim()) return null;

      // Check if this is a heading (starts with ##)
      const isHeading = item.text.trim().startsWith('##');

      if (isHeading) {
        const headingText = item.text.replace(/^##\s*/, '').trim();
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {headingText}
            </h3>
          </div>
        );
      }

      return (
        <div key={index} className="mb-4">
          <div className="text-muted-foreground leading-relaxed">
            {item.text.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} className="mb-2">
                {line}
              </p>
            ))}
          </div>

          {item.citations && item.citations.length > 0 && (
            <div className="mt-3 space-y-2">
              {item.citations.map((citation, citationIndex) => (
                <Card key={citationIndex} className="border-l-4 border-l-primary/50 bg-muted/30">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <Quote className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            {citation.document_title}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Pág. {citation.start_page_number}
                            {citation.start_page_number !== citation.end_page_number &&
                              `-${citation.end_page_number}`
                            }
                          </Badge>
                        </div>
                        <blockquote className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3">
                          {citation.cited_text.replace(/\r/g, ' ').substring(0, 200)}
                          {citation.cited_text.length > 200 && '...'}
                        </blockquote>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          Análise do Documento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderContent()}

        <Separator className="my-6" />

        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
          <span>Modelo: {data.model_used}</span>
          <div className="flex items-center gap-4">
            <span>Tokens de entrada: {data.usage.input_tokens.toLocaleString()}</span>
            <span>Tokens de saída: {data.usage.output_tokens.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
