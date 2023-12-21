from django.db import models

class StickyNote(models.Model):
    text = models.TextField()
    color = models.CharField(max_length=7, default='#FFFFFF')  # Hex color
    tag = models.CharField(max_length=100, blank=True)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]
