from pydantic import BaseModel, model_validator

class GetRandVideosRequest(BaseModel):
    videos_per_page: int = 15
    limit: int = 30

    @model_validator(mode="after")
    def validate_to_limit(self):
        if self.videos_per_page > self.limit:
            raise ValueError("Total rows should not exceed from the limit.")
        return self