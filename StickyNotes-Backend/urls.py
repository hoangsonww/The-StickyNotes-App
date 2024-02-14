from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('notes/<int:pk>/', views.note_detail, name='note_detail'),
]
