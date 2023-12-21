import UIKit

class CalculatorViewController: UIViewController {

    // MARK: - Properties
    @IBOutlet weak var displayLabel: UILabel!
    private var currentOperation: Operation?
    private var firstOperand: Double = 0
    private var secondOperand: Double = 0
    private var isTypingNumber: Bool = false

    enum Operation {
        case add, subtract, multiply, divide, none
    }

    // MARK: - Lifecycle Methods
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    // MARK: - Actions
    @IBAction func numberPressed(_ sender: UIButton) {
        let numberText = sender.titleLabel?.text ?? ""

        if isTypingNumber {
            displayLabel.text = displayLabel.text! + numberText
        } else {
            displayLabel.text = numberText
            isTypingNumber = true
        }
    }

    @IBAction func operationPressed(_ sender: UIButton) {
        isTypingNumber = false
        firstOperand = Double(displayLabel.text!) ?? 0
        currentOperation = Operation(rawValue: sender.tag) ?? .none
    }

    @IBAction func equalsPressed(_ sender: UIButton) {
        isTypingNumber = false
        secondOperand = Double(displayLabel.text!) ?? 0

        if let operation = currentOperation {
            switch operation {
            case .add:
                displayLabel.text = "\(firstOperand + secondOperand)"
            case .subtract:
                displayLabel.text = "\(firstOperand - secondOperand)"
            case .multiply:
                displayLabel.text = "\(firstOperand * secondOperand)"
            case .divide:
                displayLabel.text = firstOperand != 0 ? "\(secondOperand / firstOperand)" : "Error"
            case .none:
                break
            }
        }
    }

    @IBAction func clearPressed(_ sender: UIButton) {
        displayLabel.text = "0"
        firstOperand = 0
        secondOperand = 0
        currentOperation = .none
        isTypingNumber = false
    }

    @IBAction func plusMinusPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(value * -1)"
        }
    }

    @IBAction func percentagePressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(value / 100)"
        }
    }

    @IBAction func dotPressed(_ sender: UIButton) {
        if let text = displayLabel.text, !text.contains(".") {
            displayLabel.text = text + "."
        }
    }

    @IBAction func backspacePressed(_ sender: UIButton) {
        if let text = displayLabel.text, text.count > 1 {
            displayLabel.text = String(text.dropLast())
        } else {
            displayLabel.text = "0"
        }
    }

    @IBAction func squareRootPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(sqrt(value))"
        }
    }

    @IBAction func piPressed(_ sender: UIButton) {
        displayLabel.text = "\(Double.pi)"
    }

    @IBAction func sinPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(sin(value))"
        }
    }

    @IBAction func cosPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(cos(value))"
        }
    }

    @IBAction func tanPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(tan(value))"
        }
    }

    @IBAction func logPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(log(value))"
        }
    }

    @IBAction func lnPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(log(value))"
        }
    }

    @IBAction func ePressed(_ sender: UIButton) {
        displayLabel.text = "\(M_E)"
    }

    @IBAction func xSquaredPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(pow(value, 2))"
        }
    }

    @IBAction func xCubedPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(pow(value, 3))"
        }
    }

    @IBAction func xToTheYPowerPressed(_ sender: UIButton) {
        isTypingNumber = false
        firstOperand = Double(displayLabel.text!) ?? 0
        currentOperation = .multiply
    }

    @IBAction func eToTheXPowerPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(pow(M_E, value))"
        }
    }

    @IBAction func tenToTheXPowerPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(pow(10, value))"
        }
    }

    @IBAction func oneOverXPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(1 / value)"
        }
    }

    @IBAction func factorialPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(factorial(value))"
        }
    }

    @IBAction func eToTheXMinusOnePressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(pow(M_E, value) - 1)"
        }
    }

    @IBAction func tenToTheXMinusOnePressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(pow(10, value) - 1)"
        }
    }

    @IBAction func twoToTheXPowerPressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(pow(2, value))"
        }
    }

    @IBAction func twoToTheXMinusOnePressed(_ sender: UIButton) {
        if let text = displayLabel.text, let value = Double(text) {
            displayLabel.text = "\(pow(2, value) - 1)"
        }
    }
}
