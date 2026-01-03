from fastapi import HTTPException, status


class NotFoundError(HTTPException):
    """Raised when a requested resource is not found."""

    def __init__(self, resource: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} not found",
        )


class DuplicateError(HTTPException):
    """Raised when attempting to create a duplicate resource."""

    def __init__(self, resource: str, field: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{resource} with this {field} already exists",
        )


class ForbiddenError(HTTPException):
    """Raised when user lacks permission to access a resource."""

    def __init__(self, message: str = "Not authorized to access this resource"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message,
        )


class ValidationError(HTTPException):
    """Raised when request validation fails."""

    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )
