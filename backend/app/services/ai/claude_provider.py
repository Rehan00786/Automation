from anthropic import Anthropic


class ClaudeProvider:
    def __init__(self, api_key: str) -> None:
        self._client = Anthropic(api_key=api_key)

    def generate(self, prompt: str) -> str:
        response = self._client.messages.create(
            model="claude-3-5-sonnet-latest",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        text_blocks = [block.text for block in response.content if block.type == "text"]
        return "\n".join(text_blocks)
