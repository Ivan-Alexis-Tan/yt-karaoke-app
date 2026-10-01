from typing import TypedDict

class CredentialToken(TypedDict):
    sub: str
    email: str
    name: str
    picture: str
    iat: int
    exp: int