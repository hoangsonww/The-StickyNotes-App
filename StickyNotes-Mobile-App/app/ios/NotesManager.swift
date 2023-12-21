import Foundation

struct Note: Codable {
    var id: String
    var title: String
    var content: String
}

class NotesManager {
    static let shared = NotesManager()

    private init() {}

    func fetchNotes() -> [Note] {
        guard let notesData = UserDefaults.standard.data(forKey: "notes") else {
            return []
        }
        let decoder = JSONDecoder()
        if let notes = try? decoder.decode([Note].self, from: notesData) {
            return notes
        }
        return []
    }

    func saveNotes(_ notes: [Note]) {
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(notes) {
            UserDefaults.standard.set(encoded, forKey: "notes")
        }
    }
}
