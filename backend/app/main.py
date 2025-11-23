from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, get_db
from . import crud, schemas

Base.metadata.create_all(bind=engine)
app = FastAPI()

# Allow CORS for frontend deployment (replace later with correct domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/trees", response_model=list[schemas.TreeResponse])
def get_trees(db: Session = Depends(get_db)):
    return crud.get_all_trees(db)

@app.post("/trees", response_model=schemas.TreeResponse)
def create_tree(tree: schemas.TreeCreate, db: Session = Depends(get_db)):
    return crud.create_tree(db, tree)

@app.put("/trees/{tree_id}", response_model=schemas.TreeResponse)
def update_tree(tree_id: int, tree: schemas.TreeUpdate, db: Session = Depends(get_db)):
    updated = crud.update_tree(db, tree_id, tree)
    if updated is None:
        raise HTTPException(status_code=404, detail="Tree not found")
    return updated

@app.delete("/trees/{tree_id}", status_code=204)
def delete_tree_endpoint(tree_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_tree(db, tree_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Tree not found")

