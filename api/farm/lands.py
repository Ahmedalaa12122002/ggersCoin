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
            "unlocked": True if i == 1 else False,
            "vip_required": False if i == 1 else True,
            "status": "empty"
        })

    return {
        "success": True,
        "lands": lands
    }
