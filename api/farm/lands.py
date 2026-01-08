from fastapi import APIRouter

router = APIRouter()

@router.get("/api/farm/lands")
def get_lands():
    lands = []
    for i in range(1, 13):
        lands.append({
            "id": i,
            "locked": False if i == 1 else True
        })

    return {
        "lands": lands
    }
