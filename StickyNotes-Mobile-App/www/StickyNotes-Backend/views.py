from django.shortcuts import render
from .models import StickyNote

def index(request):
    notes = StickyNote.objects.all().order_by('-created_at')
    return render(request, 'stickynotes/index.html', {'notes': notes})

def note_detail(request, pk):
    note = StickyNote.objects.get(pk=pk)
    return render(request, 'stickynotes/note_detail.html', {'note': note})
