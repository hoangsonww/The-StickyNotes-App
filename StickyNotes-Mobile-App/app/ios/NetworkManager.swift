import Foundation

class NetworkManager {
    static let shared = NetworkManager()

    private init() {}

    func fetchData(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        guard let url = URL(string: urlString) else {
            completion(nil, NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"]))
            return
        }

        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    completion(nil, error)
                    return
                }
                completion(data, nil)
            }
        }
        task.resume()
    }

    func fetchImage(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchJSON(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchXML(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchHTML(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchText(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchPDF(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchVideo(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchAudio(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchBinary(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

    func fetchJSON(from urlString: String, completion: @escaping (Data?, Error?) -> Void) {
        fetchData(from: urlString, completion: completion)
    }

}