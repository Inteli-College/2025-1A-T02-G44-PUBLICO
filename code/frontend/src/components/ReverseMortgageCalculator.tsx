import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReverseResult {
  initial_principal_limit: number;
}

export const ReverseMortgageCalculator = () => {
  const [formData, setFormData] = useState({
    property_value: "",
    age: "",
    expected_interest_rate: "",
    program_cap: "",
  });
  const [result, setResult] = useState<ReverseResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("property_value", formData.property_value);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("expected_interest_rate", (parseFloat(formData.expected_interest_rate) / 100).toString());
      formDataToSend.append("program_cap", formData.program_cap);

      const response = await fetch("/api/mortgage/reverse", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Erro no cálculo");
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Cálculo concluído!",
        description: "Resultado da Hipoteca Reversa calculado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha no cálculo. Verifique os dados inseridos.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          Calculadora Hipoteca Reversa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_value_reverse">Valor Avaliado do Imóvel (R$)</Label>
              <Input
                id="property_value_reverse"
                type="number"
                value={formData.property_value}
                onChange={(e) => handleInputChange("property_value", e.target.value)}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="age_reverse">Idade do Mutuário</Label>
              <Input
                id="age_reverse"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                required
                min="62"
                max="110"
              />
            </div>
            <div>
              <Label htmlFor="expected_interest_rate">Taxa de Juros Esperada (%)</Label>
              <Input
                id="expected_interest_rate"
                type="number"
                step="0.01"
                value={formData.expected_interest_rate}
                onChange={(e) => handleInputChange("expected_interest_rate", e.target.value)}
                required
                min="0"
                max="15"
              />
            </div>
            <div>
              <Label htmlFor="program_cap">Limite Máximo do Programa (R$)</Label>
              <Input
                id="program_cap"
                type="number"
                value={formData.program_cap}
                onChange={(e) => handleInputChange("program_cap", e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
          
          <Button type="submit" disabled={isCalculating} className="w-full">
            {isCalculating ? "Calculando..." : "Calcular Hipoteca Reversa"}
          </Button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-accent/10 rounded-lg">
            <h3 className="font-semibold mb-2">Resultado:</h3>
            <p className="text-lg">
              <strong>Limite Principal Inicial: </strong>
              R$ {result.initial_principal_limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};