import UIKit

class ReminderViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    @IBOutlet weak var tableView: UITableView!

    var reminders: [Reminder] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        loadReminders()
    }

    private func loadReminders() {
        reminders = Reminder.getSampleReminders()
        tableView.reloadData()
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return reminders.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ReminderCell", for: indexPath)
        let reminder = reminders[indexPath.row]
        cell.textLabel?.text = reminder.title
        cell.detailTextLabel?.text = reminder.dueDate
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let reminder = reminders[indexPath.row]
        print("Selected reminder: \(reminder.title)")
    }

}

struct Reminder {
    let title: String
    let dueDate: String

    static func getSampleReminders() -> [Reminder] {
        return [
            Reminder(title: "Meeting with team", dueDate: "2023-01-15 10:00"),
            Reminder(title: "Doctor's appointment", dueDate: "2023-01-20 15:30"),
            Reminder(title: "Buy groceries", dueDate: "2023-01-25 18:00"),
            Reminder(title: "Pay bills", dueDate: "2023-01-30 12:00"),
            Reminder(title: "Pick up kids", dueDate: "2023-02-01 16:00"),
        ]
    }
}
