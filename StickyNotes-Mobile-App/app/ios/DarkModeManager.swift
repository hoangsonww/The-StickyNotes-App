import UIKit

class DarkModeManager {
    static let shared = DarkModeManager()

    private init() {}

    func enableDarkMode() {
        UserDefaults.standard.set(true, forKey: "DarkModeEnabled")
        setDarkModeStatus(true)
    }

    func disableDarkMode() {
        UserDefaults.standard.set(false, forKey: "DarkModeEnabled")
        setDarkModeStatus(false)
    }

    func setDarkModeStatus(_ enabled: Bool) {
        UIApplication.shared.windows.forEach { window in
            window.overrideUserInterfaceStyle = enabled ? .dark : .light
        }
    }

    func loadDarkModeStatus() {
        let isDarkModeEnabled = UserDefaults.standard.bool(forKey: "DarkModeEnabled")
        setDarkModeStatus(isDarkModeEnabled)
    }
}
