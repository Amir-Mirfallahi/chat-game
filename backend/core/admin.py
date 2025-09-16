from django.contrib import admin
from .models import Child, Session, SessionAnalytics


# Register your models here.
admin.site.register(Child)
admin.site.register(Session)
admin.site.register(SessionAnalytics)
