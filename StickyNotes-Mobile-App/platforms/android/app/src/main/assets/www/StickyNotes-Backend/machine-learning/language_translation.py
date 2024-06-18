from googletrans import Translator

def translate_text(text, dest_language):
    translator = Translator()
    translation = translator.translate(text, dest=dest_language)
    return translation.text

def main():
    text = "This is a great app!"
    translated_text = translate_text(text, 'es')  # Translating to Spanish