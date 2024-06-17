from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CapturedImage
from .serializers import CapturedImageSerializer
from django.shortcuts import get_object_or_404

@api_view(['POST'])
def receive_image(request):
    if request.method == 'POST':
        serializer = CapturedImageSerializer(data=request.data)
        if serializer.is_valid():
            saved_image = serializer.save()
            return Response({'id': saved_image.id, 'image': saved_image.image, 'timestamp': saved_image.timestamp}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_images(request):
    if request.method == 'GET':
        images = CapturedImage.objects.all()
        serializer = CapturedImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_image_by_id(request, pk):
    image = get_object_or_404(CapturedImage, pk=pk)
    serializer = CapturedImageSerializer(image)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_image_by_id(request, pk):
    try:
        image = CapturedImage.objects.get(pk=pk)
        image.delete()
        return Response({'message': 'Image deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except CapturedImage.DoesNotExist:
        return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)