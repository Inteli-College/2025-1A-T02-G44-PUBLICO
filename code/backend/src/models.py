from typing import Any

from pydantic import BaseModel, Field


# Models for reverse mortgage calculations
class ViagerRequest(BaseModel):
    property_value: float = Field(
        description="Full market value of the property (what you think the actual value of the property is).",
        gt=0
    )
    annual_rent: float = Field(
        description="Expected annual rental value (what you think you can rent the property for).",
        gt=0
    )
    age: int = Field(
        description="Age of the seller in years. Used to calculate life expectancy and payment periods.",
        ge=60,
        le=110
    )
    discount_rate: float = Field(
        description="Annual discount rate in decimal (e.g., 0.05 for 5%). The rate at which future rent payments are discounted.",
        ge=0,
        lt=1
    )
    upfront_payment: float = Field(
        description="Upfront payment fraction in decimal (e.g., 0.2 for 20%). The percentage of the occupied value paid upfront.",
        ge=0,
        le=1
    )

    class Config:
        json_schema_extra: dict[str, dict[str, Any]] = {
            "example": {
                "property_value": 1000000,
                "annual_rent": 36000,
                "age": 70,
                "discount_rate": 0.05,
                "upfront_payment": 0.2,
            }
        }

class ViagerResponse(BaseModel):
    annual_annuity: float = Field(
        description="Annual annuity amount in the same currency as property value. This is the yearly payment the buyer will make to the seller."
    )

class ReverseRequest(BaseModel):
    property_value: float = Field(
        description="Appraised home value (what you think the actual value of the property is).",
        gt=0
    )
    age: int = Field(
        description="Age of the borrower in years. Higher age typically results in higher loan amounts.",
        ge=62,
        le=110
    )
    expected_interest_rate: float = Field(
        description="Expected interest rate in decimal (e.g., 0.05 for 5%). Affects how quickly the loan balance grows.",
        ge=0,
        lt=0.15
    )
    program_cap: float = Field(
        description="Program cap (maximum claim amount). The regulatory maximum loan limit established by the lending program.",
        gt=0
    )

    class Config:
        json_schema_extra = {
            "example": {
                "property_value": 1000000,
                "age": 70,
                "expected_interest_rate": 0.04,
                "program_cap": 1200000
            }
        }

class ReverseResponse(BaseModel):
    initial_principal_limit: float = Field(
        description="Initial principal limit. The maximum amount of money a borrower can receive from the reverse mortgage."
    )
