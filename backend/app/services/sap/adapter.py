from typing import Protocol


class SAPAdapter(Protocol):
    def list_users(self) -> list[dict[str, str]]: ...

    def assign_role(self, username: str, role_name: str) -> None: ...
