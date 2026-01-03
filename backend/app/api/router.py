from fastapi import APIRouter

from app.api.v1 import products, repositories, work_items, documents, app_info

api_router = APIRouter(prefix="/api")

api_router.include_router(products.router)
api_router.include_router(repositories.router)
api_router.include_router(work_items.router)
api_router.include_router(documents.router)
api_router.include_router(app_info.router)
