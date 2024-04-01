import speech_recognition as sr

def recognize_speech_from_audio(file_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)
        return text

def main():
    audio_path = 'path/to/audio/file.wav'
    recognized_text = recognize_speech_from_audio(audio_path)
    print(recognized_text)
    print('Done')
