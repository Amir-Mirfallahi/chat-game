from django.contrib import admin
from .models import Child


# Register your models here.
@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    pass