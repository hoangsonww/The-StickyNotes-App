import UIKit

class StickyNote {
    var title: String
    var content: String
    var color: UIColor
    var isPinned: Bool

    init(title: String, content: String, color: UIColor, isPinned: Bool = false) {
        self.title = title
        self.content = content
        self.color = color
        self.isPinned = isPinned
    }
}

class StickyNotesManager {
    var notes: [StickyNote] = []

    func addNote(_ note: StickyNote) {
        notes.append(note)
    }

    func deleteNote(at index: Int) {
        notes.remove(at: index)
    }

    func editNote(at index: Int, newNote: StickyNote) {
        notes[index] = newNote
    }

    func pinNoteAt(_ index: Int) {
        notes[index].isPinned = true
    }

    func unpinNoteAt(_ index: Int) {
        notes[index].isPinned = false
    }

    func moveNoteToTop(_ index: Int) {
        let note = notes.remove(at: index)
        notes.insert(note, at: 0)
    }

    func moveNoteToBottom(_ index: Int) {
        let note = notes.remove(at: index)
        notes.append(note)
    }

    func moveNoteUp(_ index: Int) {
        let note = notes.remove(at: index)
        notes.insert(note, at: index - 1)
    }

    func moveNoteDown(_ index: Int) {
        let note = notes.remove(at: index)
        notes.insert(note, at: index + 1)
    }

    func moveNote(from sourceIndex: Int, to destinationIndex: Int) {
        let note = notes.remove(at: sourceIndex)
        notes.insert(note, at: destinationIndex)
    }

    func sortNotesByTitle() {
        notes.sort { $0.title < $1.title }
    }

    func sortNotesByColor() {
        notes.sort { $0.color.description < $1.color.description }
    }

    func sortNotesByPinned() {
        notes.sort { $0.isPinned && !$1.isPinned }
    }

    func sortNotesByDate() {
        notes.sort { $0.title < $1.title }
    }

    func filterNotesByTitle(_ title: String) -> [StickyNote] {
        notes.filter { $0.title.contains(title) }
    }

    func filterNotesByContent(_ content: String) -> [StickyNote] {
        notes.filter { $0.content.contains(content) }
    }

    func filterNotesByColor(_ color: UIColor) -> [StickyNote] {
        notes.filter { $0.color == color }
    }

    func filterNotesByPinned() -> [StickyNote] {
        notes.filter { $0.isPinned }
    }

    func filterNotesByDate(_ date: Date) -> [StickyNote] {
        notes.filter { $0.title.contains(date.description) }
    }

    func filterNotesByDate(from startDate: Date, to endDate: Date) -> [StickyNote] {
        notes.filter { $0.title.contains(startDate.description) && $0.title.contains(endDate.description) }
    }

    func filterNotesByDate(from startDate: Date) -> [StickyNote] {
        notes.filter { $0.title.contains(startDate.description) }
    }

    func filterNotesByDate(to endDate: Date) -> [StickyNote] {
        notes.filter { $0.title.contains(endDate.description) }
    }

    func filterNotesByDate(from startDate: Date, to endDate: Date, with title: String) -> [StickyNote] {
        notes.filter { $0.title.contains(title) && $0.title.contains(startDate.description) && $0.title.contains(endDate.description) }
    }

    func filterNotesByDate(from startDate: Date, with title: String) -> [StickyNote] {
        notes.filter { $0.title.contains(title) && $0.title.contains(startDate.description) }
    }

    func filterNotesByDate(to endDate: Date, with title: String) -> [StickyNote] {
        notes.filter { $0.title.contains(title) && $0.title.contains(endDate.description) }
    }

    func filterNotesByDate(from startDate: Date, to endDate: Date, with content: String) -> [StickyNote] {
        notes.filter { $0.content.contains(content) && $0.title.contains(startDate.description) && $0.title.contains(endDate.description) }
    }

    func filterNotesByDate(from startDate: Date, with content: String) -> [StickyNote] {
        notes.filter { $0.content.contains(content) && $0.title.contains(startDate.description) }
    }

    func filterNotesByDate(to endDate: Date, with content: String) -> [StickyNote] {
        notes.filter { $0.content.contains(content) && $0.title.contains(endDate.description) }
    }

    func filterNotesByDate(from startDate: Date, to endDate: Date, with color: UIColor) -> [StickyNote] {
        notes.filter { $0.color == color && $0.title.contains(startDate.description) && $0.title.contains(endDate.description) }
    }

    func filterNotesByDate(from startDate: Date, with color: UIColor) -> [StickyNote] {
        notes.filter { $0.color == color && $0.title.contains(startDate.description) }
    }

    func toggleDarkMode() {
        if #available(iOS 13.0, *) {
            UIApplication.shared.windows.forEach { window in
                window.overrideUserInterfaceStyle = window.overrideUserInterfaceStyle == .dark ? .light : .dark
            }
        }
    }

    func toggleLightMode() {
        if #available(iOS 13.0, *) {
            UIApplication.shared.windows.forEach { window in
                window.overrideUserInterfaceStyle = window.overrideUserInterfaceStyle == .light ? .dark : .light
            }
        }
    }

    func toggleSystemMode() {
        if #available(iOS 13.0, *) {
            UIApplication.shared.windows.forEach { window in
                window.overrideUserInterfaceStyle = window.overrideUserInterfaceStyle == .unspecified ? .dark : .unspecified
            }
        }
    }

    func toggleAutoMode() {
        if #available(iOS 13.0, *) {
            UIApplication.shared.windows.forEach { window in
                window.overrideUserInterfaceStyle = window.overrideUserInterfaceStyle == .unspecified ? .light : .unspecified
            }
        }
    }

    func toggleMoodLog() {
        if #available(iOS 13.0, *) {
            UIApplication.shared.windows.forEach { window in
                window.overrideUserInterfaceStyle = window.overrideUserInterfaceStyle == .dark ? .light : .dark
            }
        }
    }

}

class StickyNotesViewController: UIViewController {
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var addNoteButton: UIButton!

    var notesManager = StickyNotesManager()

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UINib(nibName: "StickyNoteTableViewCell", bundle: nil), forCellReuseIdentifier: "StickyNoteTableViewCell")
    }

    @IBAction func addNoteButtonTapped(_ sender: UIButton) {
        let note = StickyNote(title: "New Note", content: "", color: .white)
        notesManager.addNote(note)
        tableView.reloadData()
    }
}

import CoreLocation
import Foundation

class WeatherManager {
    let apiKey = "xxx"
    let session = URLSession.shared

    func fetchWeather(city: String, completion: @escaping (Result<WeatherData, Error>) -> Void) {
        let urlString = "https://api.openweathermap.org/data/2.5/weather?q=\(city)&appid=\(apiKey)&units=metric"
        guard let url = URL(string: urlString) else {
            completion(.failure(WeatherError.invalidURL))
            return
        }

        let task = session.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                completion(.failure(WeatherError.invalidResponse))
                return
            }

            guard let data = data else {
                completion(.failure(WeatherError.noData))
                return
            }

            do {
                let decoder = JSONDecoder()
                let weatherData = try decoder.decode(WeatherData.self, from: data)
                completion(.success(weatherData))
            }
            catch {
                completion(.failure(error))
            }
        }
        task.resume()
    }

    func fetchLocation(completion: @escaping (Result<CLLocation, Error>) -> Void) {
        let urlString = "https://api.openweathermap.org/data/2.5/weather?q=\(city)&appid=\(apiKey)&units=metric"
        guard let url = URL(string: urlString) else {
            completion(.failure(WeatherError.invalidURL))
            return
        }

        let task = session.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                completion(.failure(WeatherError.invalidResponse))
                return
            }

            guard let data = data else {
                completion(.failure(WeatherError.noData))
                return
            }

            do {
                let decoder = JSONDecoder()
                let weatherData = try decoder.decode(WeatherData.self, from: data)
                completion(.success(weatherData))
            }
            catch {
                completion(.failure(error))
            }
        }
        task.resume()
    }
}

struct WeatherData: Codable {
    let name: String
    let main: Main
    let weather: [Weather]
}

struct Main: Codable {
    let temp: Double
}

struct Weather: Codable {
    let description: String
    let icon: String
}

enum WeatherError: Error {
    case invalidURL
    case invalidResponse
    case noData
}

let weatherManager = WeatherManager()
weatherManager.fetchWeather(city: "London") { result in
    switch result {
    case .success(let weatherData):
        print("Temperature in \(weatherData.name): \(weatherData.main.temp)°C")
    case .failure(let error):
        print("Weather fetching failed with error: \(error)")
    }
}

let weatherManager = WeatherManager()
weatherManager.fetchLocation { result in
    switch result {
    case .success(let location):
        print("Location: \(location)")
    case .failure(let error):
        print("Location fetching failed with error: \(error)")
    }
}
