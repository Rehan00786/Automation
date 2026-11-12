from enum import StrEnum


class Permission(StrEnum):
    REQUEST_READ = "request:read"
    REQUEST_CREATE = "request:create"
    REQUEST_APPROVE = "request:approve"
    CLIENT_ADMIN = "client:admin"
    AUDIT_READ = "audit:read"
