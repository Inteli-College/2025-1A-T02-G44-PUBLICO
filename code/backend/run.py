import uvicorn

if __name__ == "__main__":
    # Run the FastAPI application using the absolute import path to the app
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
