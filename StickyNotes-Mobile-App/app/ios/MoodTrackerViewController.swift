import UIKit

class MoodTrackerViewController: UIViewController {
    @IBOutlet weak var moodPicker: UIPickerView!

    let moods = ["Happy", "Sad", "Stressed", "Relaxed"]

    override func viewDidLoad() {
        super.viewDidLoad()
        moodPicker.delegate = self
        moodPicker.dataSource = self
    }

    @IBAction func logMoodButtonTapped(_ sender: UIButton) {
        let selectedMood = moods[moodPicker.selectedRow(inComponent: 0)]
        selectedMood == "Happy" ? print("😀") : print("😢")
        print("Mood logged: \(selectedMood)")
    }
}

extension MoodTrackerViewController: UIPickerViewDelegate, UIPickerViewDataSource {
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }

    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return moods.count
    }

    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return moods[row]
    }
}
