import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  processingStatus?: string;
}

export const FileUpload = ({ onFileSelect, isProcessing, processingStatus }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const files = Array.from(e.dataTransfer.files);
      const pdfFile = files.find(file => file.type === "application/pdf");
      
      if (pdfFile) {
        setSelectedFile(pdfFile);
        onFileSelect(pdfFile);
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos PDF.",
          variant: "destructive",
        });
      }
    },
    [onFileSelect, toast]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione apenas arquivos PDF.",
        variant: "destructive",
      });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Card className="overflow-hidden shadow-elegant">
      <CardContent className="p-8">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
            ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${selectedFile ? "border-accent" : ""}
            ${isProcessing ? "opacity-50 pointer-events-none" : "hover:border-primary/50"}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          {!selectedFile ? (
            <>
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-hero">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Faça upload da Escritura Pública
              </h3>
              <p className="text-muted-foreground mb-4">
                Arraste e solte seu arquivo PDF aqui ou clique para selecionar
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              <Button variant="hero" size="lg">
                Selecionar Arquivo PDF
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              {!isProcessing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Processando...</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {processingStatus && (
          <div className="mt-4 p-4 bg-accent/10 rounded-lg">
            <p className="text-sm text-accent font-medium">{processingStatus}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};