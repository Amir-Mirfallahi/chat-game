"""
URL configuration for lle_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings  # For static/media files in DEBUG
from django.conf.urls.static import static  # For static/media files in DEBUG
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),  # Mount core app URLs under /api/
    path("api/", include("speech.urls")),  # Mount speech app URLs under /api/
    path(
        "prometheus/", include("django_prometheus.urls")
    ),  # Prometheus metrics endpoint
    # DRF Spectacular UI:
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Optional UI:
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    # path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'), # Alternative UI
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Example for browsable API login/logout (optional, good for development)
# urlpatterns += [
#     path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
# ]
