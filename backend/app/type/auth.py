from typing import TypedDict

class CredentialToken(TypedDict):
    sub: str
    provider: str
    email: str
    name: str
    picture: str
    iat: str
    iss: str
    aud: str
    exp: str