from fastapi import APIRouter

router = APIRouter()

@router.get("/api/farm/lands")
def get_lands():
    return {
        "lands": [
            {"id": 1, "locked": False},
            {"id": 2, "locked": True},
            {"id": 3, "locked": True},
            {"id": 4, "locked": True},
            {"id": 5, "locked": True},
            {"id": 6, "locked": True},
            {"id": 7, "locked": True},
            {"id": 8, "locked": True},
            {"id": 9, "locked": True},
            {"id": 10, "locked": True},
            {"id": 11, "locked": True},
            {"id": 12, "locked": True}
        ]
    }
