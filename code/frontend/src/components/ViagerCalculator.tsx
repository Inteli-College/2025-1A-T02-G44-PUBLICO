import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViagerResult {
  annual_annuity: number;
}

export const ViagerCalculator = () => {
  const [formData, setFormData] = useState({
    property_value: "",
    annual_rent: "",
    age: "",
    discount_rate: "",
    upfront_payment: "",
  });
  const [result, setResult] = useState<ViagerResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("property_value", formData.property_value);
      formDataToSend.append("annual_rent", formData.annual_rent);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("discount_rate", (parseFloat(formData.discount_rate) / 100).toString());
      formDataToSend.append("upfront_payment", (parseFloat(formData.upfront_payment) / 100).toString());

      const response = await fetch("/api/mortgage/viager", {
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
        description: "Resultado do Viager calculado com sucesso",
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
          <Calculator className="w-5 h-5 text-primary" />
          Calculadora Viager (Renda Vitalícia)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_value">Valor do Imóvel (R$)</Label>
              <Input
                id="property_value"
                type="number"
                value={formData.property_value}
                onChange={(e) => handleInputChange("property_value", e.target.value)}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="annual_rent">Renda Anual Esperada (R$)</Label>
              <Input
                id="annual_rent"
                type="number"
                value={formData.annual_rent}
                onChange={(e) => handleInputChange("annual_rent", e.target.value)}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="age">Idade do Vendedor</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                required
                min="60"
                max="110"
              />
            </div>
            <div>
              <Label htmlFor="discount_rate">Taxa de Desconto (%)</Label>
              <Input
                id="discount_rate"
                type="number"
                step="0.01"
                value={formData.discount_rate}
                onChange={(e) => handleInputChange("discount_rate", e.target.value)}
                required
                min="0"
                max="100"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="upfront_payment">Pagamento Inicial (%)</Label>
              <Input
                id="upfront_payment"
                type="number"
                step="0.01"
                value={formData.upfront_payment}
                onChange={(e) => handleInputChange("upfront_payment", e.target.value)}
                required
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <Button type="submit" disabled={isCalculating} className="w-full">
            {isCalculating ? "Calculando..." : "Calcular Viager"}
          </Button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-accent/10 rounded-lg">
            <h3 className="font-semibold mb-2">Resultado:</h3>
            <p className="text-lg">
              <strong>Anuidade: </strong>
              R$ {result.annual_annuity.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};