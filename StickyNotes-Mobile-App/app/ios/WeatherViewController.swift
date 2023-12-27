import UIKit

class WeatherViewController: UIViewController {
    @IBOutlet weak var cityLabel: UILabel!
    @IBOutlet weak var temperatureLabel: UILabel!
    @IBOutlet weak var weatherIconImageView: UIImageView!

    override func viewDidLoad() {
        super.viewDidLoad()
        fetchWeatherData()
    }

    private func fetchWeatherData() {
        WeatherAPI.getWeather { [weak self] (weather, error) in
            guard let self = self, let weather = weather else {
                return
            }
            self.updateWeatherDisplay(weather)
        }
    }

    private func updateWeatherDisplay(_ weather: Weather) {
        DispatchQueue.main.async {
            self.cityLabel.text = weather.city
            self.temperatureLabel.text = "\(weather.temperature)°C"
            self.weatherIconImageView.image = UIImage(named: weather.iconName)
        }
    }
}

struct Weather {
    let city: String
    let temperature: Double
    let iconName: String
}

class WeatherAPI {
    static func getWeather(completion: @escaping (Weather?, Error?) -> Void) {
        let weather = api.getWeather()
        completion(weather, nil)
    }
}
