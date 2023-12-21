import android.os.AsyncTask;
import android.util.Log;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class FetchWeatherTask extends AsyncTask<String, Void, String> {

    private static final String API_KEY = "YOUR_API_KEY";
    private static final String WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=" + API_KEY + "&units=metric";

    @Override
    protected String doInBackground(String... params) {
        String cityName = params[0];
        HttpURLConnection urlConnection = null;
        BufferedReader reader = null;

        try {
            URL url = new URL(String.format(WEATHER_URL, cityName));
            urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("GET");
            urlConnection.connect();

            InputStreamReader inputStream = new InputStreamReader(urlConnection.getInputStream());
            reader = new BufferedReader(inputStream);

            StringBuilder buffer = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line).append("\n");
            }

            return buffer.toString();
        } catch (Exception e) {
            Log.e("FetchWeatherTask", "Error ", e);
            return null;
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
            if (reader != null) {
                try {
                    reader.close();
                }
                catch (Exception e) {
                    Log.e("FetchWeatherTask", "Error closing stream", e);
                }
            }
        }
    }

    @Override
    protected void onPostExecute(String weatherData) {
        super.onPostExecute(weatherData);
        try {
            JSONObject jsonObject = new JSONObject(weatherData);
            double temp = jsonObject.getJSONObject("main").getDouble("temp");
            String cityName = jsonObject.getString("name");
            Log.d("Weather", "Temperature in " + cityName + ": " + temp + "°C");
        } catch (Exception e) {
            Log.e("FetchWeatherTask", "Error parsing JSON", e);
        }
    }
}
