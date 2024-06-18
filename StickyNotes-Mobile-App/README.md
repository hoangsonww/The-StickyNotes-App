# StickyNotes Mobile App

## Overview
StickyNotes is an intuitive and versatile mobile application designed to enhance note-taking and task management. It offers a convenient way to jot down ideas, organize tasks, and track your productivity. Available for both iOS and Android, the app combines the simplicity of traditional sticky notes with the power of digital organization.

## Features
- **Create and Organize Notes**: Easily create, edit, and organize notes.
- **Task Management**: Set due dates and reminders for your tasks.
- **Customizable Themes**: Personalize your experience with customizable themes.
- **Dark Mode**: Reduce eye strain with a user-friendly dark mode.
- **Offline Access**: Access your notes even without an internet connection.

## Development
- **iOS Version**: Developed in Swift and Apache Cordova for a seamless iOS experience.
- **Android Version**: Built using Kotlin, Java, and Apache Cordova to optimize for Android devices.
- **Cross-Platform**: Leveraged React Native for consistent performance across both platforms.
- **Backend**: Utilized Firebase for a reliable and scalable backend.

## Installation

### iOS
1. Clone the repository.
2. Open `StickyNotes.xcodeproj` in Xcode.
3. Configure signing and capabilities.
4. Build and run on an iOS device or emulator.

Note: If you change the code, you must remove iOS platform and add it again using the following commands in order for these changes to take effect:
```bash
cordova platforms rm ios
cordova platforms add ios
```

### Android
1. Clone the repository.
2. Open the project `StickyNotes-Mobile-App` in Android Studio.
3. Synchronize Gradle dependencies.
4. Build and run on an Android device or emulator.

If your installation is successful, you should see the following output: 

#### iOS
<p align="center" style="cursor: pointer">
    <img src="../utils/mobileios.png" alt="The StickyNotes App Interface" width="80%" style="border-radius: 8px"/>
</p>

#### Android
<p align="center" style="cursor: pointer">
    <img src="../utils/mobileandroid.png" alt="The StickyNotes App Interface" width="80%" style="border-radius: 8px"/>
</p>

## Usage
After launching StickyNotes, you can start creating notes right away. The app's home screen displays your notes, which you can customize, categorize, and search through. The intuitive interface allows for easy navigation and management of your tasks and ideas.

## Contributing
We welcome contributions to improve StickyNotes. Please review our contribution guidelines for submitting pull requests.

## License
StickyNotes is licensed under MIT.

## Contact
For support, feature requests, or queries, reach out to us at [info@movie-verse.com](mailto:info@movie-verse.com).

## Acknowledgments
Thanks to all the developers, designers, and users who have contributed to making StickyNotes a helpful tool for thousands of people.

---
