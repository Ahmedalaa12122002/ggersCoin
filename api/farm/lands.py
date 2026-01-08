from fastapi import APIRouter

router = APIRouter(prefix="/api/farm", tags=["Farm"])

@router.get("/lands")
def get_lands(user_id: int, vip: bool = False):
    lands = []

    for i in range(1, 13):
        if i == 1:
            status = "open"
        elif vip:
            status = "open"
        else:
            status = "locked"

        lands.append({
            "id": i,
            "status": status
        })

    return {
        "lands": lands
    }
