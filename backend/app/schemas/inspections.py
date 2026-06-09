from datetime import date
from typing import Literal

from pydantic import BaseModel, model_validator


InspectionResult = Literal["pending", "passed", "整改", "failed"]


class InspectionBase(BaseModel):
    project_id: int
    project_name: str
    inspection_type: str
    scheduled_date: date
    inspector: str
    result: InspectionResult = "pending"
    issues: str = ""

    @model_validator(mode="after")
    def check_issues_when_rectification(self):
        if self.result == "整改" and not self.issues.strip():
            raise ValueError("验收结果为"整改"时，整改问题不能为空")
        return self


class InspectionCreate(InspectionBase):
    pass


class InspectionUpdate(BaseModel):
    project_id: int | None = None
    project_name: str | None = None
    inspection_type: str | None = None
    scheduled_date: date | None = None
    inspector: str | None = None
    result: InspectionResult | None = None
    issues: str | None = None

    @model_validator(mode="after")
    def check_issues_when_rectification(self):
        if self.result == "整改" and (self.issues is None or not self.issues.strip()):
            raise ValueError("验收结果为"整改"时，整改问题不能为空")
        return self


class Inspection(InspectionBase):
    id: int
