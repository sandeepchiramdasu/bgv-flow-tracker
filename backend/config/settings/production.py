from .base import *
import os
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = [
    ".onrender.com",
]

CORS_ALLOWED_ORIGINS = [
    "https://bgv-flow-tracker.netlify.app",
]

CSRF_TRUSTED_ORIGINS = [
    "https://bgv-flow-tracker.netlify.app",
]

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL")
    )
}