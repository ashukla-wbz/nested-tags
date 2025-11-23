from sqlalchemy.orm import Session
from . import models, schemas

def get_all_trees(db: Session):
    return db.query(models.Tree).all()

def create_tree(db: Session, tree: schemas.TreeCreate):
    db_tree = models.Tree(
        name=tree.name,
        structure=tree.structure.dict()
    )
    db.add(db_tree)
    db.commit()
    db.refresh(db_tree)
    return db_tree

def update_tree(db: Session, tree_id: int, tree: schemas.TreeUpdate):
    db_tree = db.query(models.Tree).filter(models.Tree.id == tree_id).first()
    if not db_tree:
        return None
    db_tree.name = tree.name
    db_tree.structure = tree.structure.dict()
    db.commit()
    db.refresh(db_tree)
    return db_tree

def delete_tree(db: Session, tree_id: int):
    db_tree = db.query(models.Tree).filter(models.Tree.id == tree_id).first()
    if db_tree:
        db.delete(db_tree)
        db.commit()
        return True
    return False
