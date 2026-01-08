from fastapi import APIRouter

router = APIRouter(
    prefix="/api/farm",
    tags=["Farm"]
)

@router.get("/lands")
def get_lands():
    lands = []

    for i in range(1, 13):
        lands.append({
            "id": i,
            "locked": False if i == 1 else True
        })

    return {
        "lands": lands,
        "vip_required_from": 2
    }
