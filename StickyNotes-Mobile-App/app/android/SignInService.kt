import android.util.Log
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

object SignInService {

    private const val TAG = "SignInService"
    private const val URL = "https://StickyNotes.com/signin" // This url is not published to GitHub

    fun signIn(email: String, password: String, callback: (Result<User>) -> Unit) {
        val client = OkHttpClient()

        val requestBody = FormBody.Builder()
            .add("email", email)
            .add("password", password)
            .build()

        val request = Request.Builder()
            .url(URL)
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG, "Sign in failed", e)
                callback(Result.failure(e))
            }

            override fun onResponse(call: Call, response: Response) {
                if (!response.isSuccessful) {
                    callback(Result.failure(IOException("Unexpected code $response")))
                    return
                }

                try {
                    val responseBody = response.body?.string()
                    val jsonObject = JSONObject(responseBody ?: "")
                    val user = User(
                        id = jsonObject.getString("id"),
                        name = jsonObject.getString("name"),
                        email = jsonObject.getString("email")
                    )
                    callback(Result.success(user))
                } catch (e: Exception) {
                    callback(Result.failure(e))
                }
            }
        })
    }
}
