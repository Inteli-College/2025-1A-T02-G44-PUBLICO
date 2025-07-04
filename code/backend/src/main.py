from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import mortgage, pdf_analysis

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(mortgage.router)
app.include_router(pdf_analysis.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Reverse Mortgage API"}
