from fastapi import APIRouter

router = APIRouter(prefix="/api/farm", tags=["Farm"])

@router.get("/lands")
def get_lands():
    lands = []
    for i in range(1, 13):
        lands.append({
            "id": i,
            "locked": i != 1,   # أول أرض مفتوحة
            "vip_required": i > 1
        })
    return {"lands": lands}
