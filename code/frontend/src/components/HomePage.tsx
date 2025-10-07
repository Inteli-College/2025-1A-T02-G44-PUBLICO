import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ViagerCalculator } from "@/components/ViagerCalculator";
import { ReverseMortgageCalculator } from "@/components/ReverseMortgageCalculator";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, FileText, Calculator, Shield, Clock, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-image.jpg";

interface Citation {
  cited_text: string;
  document_index: number;
  document_title: string;
  end_page_number: number;
  start_page_number: number;
  type: string;
}

interface AnalysisResult {
  success: boolean;
  content: Array<{
    citations: Citation[] | null;
    text: string;
    type: string;
  }>;
  model_used: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export const HomePage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setProcessingStatus("Enviando documento...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProcessingStatus("Analisando com IA...");

      // Replace with your actual backend URL
      const response = await fetch("/api/pdf/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao processar documento");
      }

      const result = await response.json();
      setAnalysisResult(result);
      setProcessingStatus("Análise concluída!");

      toast({
        title: "Sucesso!",
        description: "Documento processado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao processar documento. Tente novamente.",
        variant: "destructive",
      });
      setProcessingStatus("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">HipotecaReversa</h1>
            </div>
            <Button variant="outline">
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Hipoteca Reversa e
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Viager no Brasil</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Calcule modelos de hipoteca reversa e viager adaptados para o mercado brasileiro.
                Análise completa de documentos imobiliários com IA avançada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-lg">
                  Calcular Agora
                </Button>
                <Button variant="outline" size="lg" className="text-lg">
                  Ver Demonstração
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Soluções financeiras imobiliárias"
                className="rounded-xl shadow-elegant w-full"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-elegant">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span className="font-medium">Cálculos Certificados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Analysis Section */}
      <section className="py-16 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Análise de Documentos
            </h2>
            <p className="text-muted-foreground text-lg">
              Envie sua escritura pública em formato PDF e receba análise detalhada com IA avançada
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Análise de Escritura Pública
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Envie sua escritura pública em formato PDF e receba análise detalhada com IA
                </p>
                <FileUpload
                  onFileSelect={handleFileUpload}
                  isProcessing={isProcessing}
                  processingStatus={processingStatus}
                />

                {analysisResult && (
                  <div className="mt-8">
                    <AnalysisResults data={analysisResult} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Calculadoras Financeiras
            </h2>
            <p className="text-muted-foreground text-lg">
              Use nossas calculadoras especializadas para hipoteca reversa e viager
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="reverse" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reverse">Hipoteca Reversa</TabsTrigger>
                <TabsTrigger value="viager">Viager</TabsTrigger>
              </TabsList>

              <TabsContent value="reverse" className="mt-8">
                <ReverseMortgageCalculator />
              </TabsContent>

              <TabsContent value="viager" className="mt-8">
                <ViagerCalculator />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por Que Escolher Nossa Plataforma?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Soluções completas para hipoteca reversa e análise de documentos imobiliários
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-hero flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
                <p className="text-muted-foreground">
                  Seus documentos são processados com máxima segurança e privacidade
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-hero flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cálculos Rápidos</h3>
                <p className="text-muted-foreground">
                  Resultados instantâneos para hipoteca reversa e viager
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-hero flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Modelos Brasileiros</h3>
                <p className="text-muted-foreground">
                  Adaptado para regulamentações e mercado brasileiro
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">HipotecaReversa</h3>
              </div>
              <p className="text-white/70">
                Soluções de hipoteca reversa e viager para o Brasil
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-white/70">
                <li>Hipoteca Reversa</li>
                <li>Viager Brasileiro</li>
                <li>Análise de Escrituras</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-white/70">
                <li>Central de Ajuda</li>
                <li>Documentação</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/70">
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
                <li>LGPD</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2025 HipotecaReversa. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
