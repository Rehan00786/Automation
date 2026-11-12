class MockSAPAdapter:
    def list_users(self) -> list[dict[str, str]]:
        return []

    def assign_role(self, username: str, role_name: str) -> None:
        raise NotImplementedError("Provisioning is not implemented in the mock SAP adapter.")
