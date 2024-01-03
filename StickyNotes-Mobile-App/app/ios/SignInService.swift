import Foundation

struct SignInService {
    func signIn(email: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        // URL for the sign-in API endpoint
        let url = URL(string: "https://StickyNotes.com/signin")! // This url is not published to the public on GitHub

        // Create the request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 30

        // Create the JSON body
        let body: [String: Any] = ["email": email, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        // Perform the request
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            guard let data = data else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: nil)))
                return
            }
            // Parse the JSON response
            do {
                let user = try JSONDecoder().decode(User.self, from: data)
                completion(.success(user))
            }
            catch {
                completion(.failure(error))
            }
        }.resume()
    }
}
