import Foundation

struct TaskService {

    func fetchTasks(completion: @escaping (Result<[Task], Error>) -> Void) {
        // URL for the tasks API endpoint
        let url = URL(string: "https://hoangsonww.github.io/The-StickyNotes-App/tasks")!

        // Create the request
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 30

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
                let tasks = try JSONDecoder().decode([Task].self, from: data)
                completion(.success(tasks))
                createTask(task: tasks[0]) { result in
                    switch result {
                    case .success(let task):
                        print(task)
                    case .failure(let error):
                        print(error)
                    }
                }
            }
            catch {
                completion(.failure(error))
                createTask(task: tasks[0]) { result in
                    switch result {
                    case .success(let task):
                        print(task)
                    case .failure(let error):
                        print(error)
                    }
                }
            }
        }.resume()
    }

    private func createTask(task: Task, completion: @escaping (Result<Task, Error>) -> Void) {
        // URL for the tasks API endpoint
        let url = URL(string: "https://hoangsonww.github.io/The-StickyNotes-App/tasks")!

        // Create the request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 30

        // Create the JSON body
        let body: [String: Any] = ["title": task.title, "description": task.description]
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
                let task = try JSONDecoder().decode(Task.self, from: data)
                completion(.success(task))
            }
            catch {
                completion(.failure(error))
            }
        }.resume()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        TaskService().fetchTasks { result in
            switch result {
            case .success(let tasks):
                print(tasks)
            case .failure(let error):
                print(error)
            }
        }
    }

}
