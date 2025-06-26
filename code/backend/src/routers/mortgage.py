from fastapi import APIRouter, Body, Form
from ..models import ViagerRequest, ViagerResponse, ReverseRequest, ReverseResponse

router = APIRouter(
    prefix="/mortgage",
    tags=["mortgage"]
)

# Simple IBGE-like mortality table (mock data)
def get_survival_probability(age, years):
    # Simplified mock implementation
    # We will use actual IBGE life tables in production
    base_prob = max(0, 1 - (age / 110))
    return base_prob ** years

# Calculate annuity factor
def calculate_annuity_factor(age, discount_rate):
    annuity_factor = 0
    for t in range(1, 101):  # Consider up to 100 years
        survival_prob = get_survival_probability(age, t)
        if survival_prob < 0.01:
            break
        annuity_factor += survival_prob / ((1 + discount_rate) ** t)

    return annuity_factor

# Get Principal Limit Factor (PLF)
def calculate_plf(age, expected_interest_rate):
    # Simplified mock implementation
    # Base PLF increases with age and decreases with interest rate
    base_plf = min(0.75, max(0.2, (age - 60) * 0.01 + 0.4))

    # Adjust for interest rate (higher rates → lower PLF)
    rate_adjustment = max(0, 0.05 - expected_interest_rate) * 0.5

    return max(0.2, min(0.75, base_plf + rate_adjustment))

@router.post(
    "/viager",
    response_model=ViagerResponse,
    summary="Calculate Viager (French life annuity) model",
    description="""
    Calculates the annual payment for a Viager (French life annuity) adapted for Brazil.

    The calculation takes into account:
    - Property market value
    - Potential rental income
    - Seller's age (for life expectancy)
    - Discount rate
    - Upfront payment percentage

    Returns the annual payment amount the buyer will pay to the seller.
    """
)
async def calculate_viager(
    request: ViagerRequest | None = Body(default=None),
    property_value: float = Form(default=0),
    age: int = Form(default=0, ge=60, le=110),
    discount_rate: float = Form(default=0, ge=0, le=100),
    annual_rent: float = Form(default=0, ge=0),
    upfront_payment: float = Form(default=0, ge=0, le=100),
):
    """
    Calculate simplified Brazilian Viager model - returns only the annual annuity amount

    Formula (simplified):
    a_x(δ) = sum of survival probabilities / discount factors
    V_occ = V - (rent * a_x(δ))
    R = (V_occ * (1 - p)) / a_x(δ)
    """
    # Calculate annuity factor
    if request:
        age = request.age
        discount_rate = request.discount_rate
        annual_rent = request.annual_rent
        upfront_payment = request.upfront_payment

    annuity_factor = calculate_annuity_factor(age, discount_rate)
    occupied_value = property_value - (annual_rent * annuity_factor)
    annual_annuity = (occupied_value * (1 - upfront_payment)) / annuity_factor

    return ViagerResponse(annual_annuity=annual_annuity)

@router.post(
    "/reverse",
    response_model=ReverseResponse,
    summary="Calculate Reverse Mortgage model",
    description="""
    Calculates the initial principal limit for a Reverse Mortgage adapted for Brazil.

    The calculation takes into account:
    - Property appraisal value
    - Borrower's age
    - Expected interest rate
    - Program cap (maximum loan limit)

    Returns the initial principal limit, which is the maximum amount a borrower can receive.
    """
)
async def calculate_reverse_mortgage(
    request: ReverseRequest | None = Body(default=None),
    property_value: float = Form(default=0),
    age: int = Form(default=0),
    expected_interest_rate: float = Form(default=0),
    program_cap: float = Form(default=0),
):
    """
    Calculate simplified Reverse Mortgage model - returns only the initial principal limit

    Formula (simplified):
    PL = min(V, L_max) * PLF(x, EIR)
    """
    # Calculate principal limit directly
    if request:
        principal_limit = min(
            request.property_value, request.program_cap
        ) * calculate_plf(request.age, request.expected_interest_rate)
    else:
        principal_limit = min(property_value, program_cap) * calculate_plf(
            age, expected_interest_rate
        )

    return ReverseResponse(initial_principal_limit=principal_limit)
