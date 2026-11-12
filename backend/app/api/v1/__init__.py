from fastapi import APIRouter

from app.api.v1 import approvals, audit, clients, requests, roles, sod

api_router = APIRouter()
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
api_router.include_router(approvals.router, prefix="/approvals", tags=["approvals"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(sod.router, prefix="/sod", tags=["segregation of duties"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])
