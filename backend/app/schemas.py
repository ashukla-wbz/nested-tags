from pydantic import BaseModel
from typing import List, Optional, Union

# Recursive Tag node
class TagNode(BaseModel):
    name: str
    data: Optional[str] = None
    children: Optional[List["TagNode"]] = None

    class Config:
        orm_mode = True

TagNode.update_forward_refs()

# Tree for DB
class TreeBase(BaseModel):
    name: str
    structure: TagNode

class TreeCreate(TreeBase):
    pass

class TreeUpdate(TreeBase):
    id: int

class TreeResponse(TreeBase):
    id: int
