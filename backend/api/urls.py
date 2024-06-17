from django.urls import path
from .views import receive_image, list_images, get_image_by_id, delete_image_by_id

urlpatterns = [
    path('receive-image/', receive_image, name='receive-image'),
    path('list-images/', list_images, name='list-images'),
    path('get-image/<int:pk>/', get_image_by_id, name='get-image-by-id'),
    path('delete-image/<int:pk>/', delete_image_by_id, name='delete-image-by-id'),
]
