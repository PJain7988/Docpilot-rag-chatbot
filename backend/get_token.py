from jose import jwt
import uuid
import time
from datetime import datetime, timedelta

# Create a dummy token for a fake admin user
# We'll use the secret from the config
from app.core.config import settings

def create_dummy_token():
    user_id = str(uuid.uuid4())
    expire = datetime.utcnow() + timedelta(minutes=600)
    to_encode = {"sub": user_id, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    print(f"TEST_TOKEN={encoded_jwt}")

if __name__ == "__main__":
    create_dummy_token()
