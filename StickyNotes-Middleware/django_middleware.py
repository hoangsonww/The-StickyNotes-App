# django_middleware.py
class StickyNotesMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.set_cookie('sticky_notes', 'This is a sticky note.')

        return response

class WeatherMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.set_cookie('weather', 'It is sunny today.')

        return response

class ChatbotMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.set_cookie('chatbot', 'Hello, how are you?')

        return response

class TodoListMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.set_cookie('todo_list', 'Buy groceries.')

        return response

class NewsFeedMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.set_cookie('news_feed', 'This is a news feed.')

        return response
