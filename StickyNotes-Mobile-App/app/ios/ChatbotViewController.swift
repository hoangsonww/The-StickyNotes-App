import UIKit

class ChatbotViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    // MARK: - Properties
    @IBOutlet weak var chatTableView: UITableView!
    @IBOutlet weak var messageTextField: UITextField!

    var messages: [String] = []

    // MARK: - Lifecycle Methods
    override func viewDidLoad() {
        super.viewDidLoad()
        chatTableView.delegate = self
        chatTableView.dataSource = self
    }

    // MARK: - UITableView DataSource & Delegate
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return messages.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "messageCell", for: indexPath)
        cell.textLabel?.text = messages[indexPath.row]
        return cell
    }

    // MARK: - Chat Interaction
    @IBAction func sendMessage(_ sender: UIButton) {
        if let message = messageTextField.text, !message.isEmpty {
            messages.append("You: \(message)")
            chatTableView.reloadData()

            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.receiveMessage("Hello! I'm your chatbot.")
            }
            messageTextField.text = ""
        }
    }

    // MARK: - Chatbot Interaction
    @IBAction func askQuestion(_ sender: UIButton) {
        receiveMessage("What's your favorite color?")
    }

    // MARK: - Chatbot Response
    @IBAction func receiveResponse(_ sender: UIButton) {
        receiveMessage("My favorite color is blue.")
    }

    func receiveMessage(_ message: String) {
        messages.append("Chatbot: \(message)")
        chatTableView.reloadData()
    }
}
