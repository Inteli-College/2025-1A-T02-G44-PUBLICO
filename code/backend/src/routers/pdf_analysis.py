import base64

import anthropic
from fastapi import APIRouter, File, HTTPException, UploadFile

from ..config import settings

router = APIRouter(prefix="/pdf", tags=["pdf-analysis"])


@router.post("/extract")
async def extract_pdf(file: UploadFile = File(...)):
    try:
        # Check if API key is configured
        if not settings.anthropic_api_key:
            raise HTTPException(
                status_code=500,
                detail="Anthropic API key is not configured. Please set ANTHROPIC_API_KEY environment variable.",
            )

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

        base64_encoded_pdf_data = base64.standard_b64encode(file.file.read()).decode(
            "utf-8"
        )

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
                                "type": "base64",
                                "media_type": "application/pdf",
                                "data": base64_encoded_pdf_data,
                            },
                            "title": "Matrícula de Imóvel",
                            "context": "Matrícula de Imóvel no Brasil.",
                            "citations": {"enabled": True},
                        },
                        {
                            "type": "text",
                            "text": """
                            Return the information about the 'Matrícula de Imóvel' we will provide, specifically about the property value, the name of the current owner and any pending 'alienações fiduciárias'.
                            Always answer in Brazilian Portuguese.
                            """,
                        },
                    ],
                }
            ],
        )

        return {
            "success": True,
            "content": response.content,
            "model_used": response.model,
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        }

    except Exception as e:
        print(e)
        return {"error": str(e)}
