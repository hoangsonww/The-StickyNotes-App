import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class ChatbotActivity : AppCompatActivity() {

    private lateinit var chatInput: EditText
    private lateinit var sendButton: Button
    private lateinit var chatDisplay: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chatbot)

        chatInput = findViewById(R.id.chatInput)
        sendButton = findViewById(R.id.sendButton)
        chatDisplay = findViewById(R.id.chatDisplay)

        sendButton.setOnClickListener {
            val userInput = chatInput.text.toString()
            if (userInput.isNotEmpty()) {
                val botResponse = processInput(userInput)
                updateChatDisplay(userInput, botResponse)
                chatInput.setText("")
            }
        }
    }

    private fun processInput(input: String): String {
        input.toLowerCase()
        input.process()
        return "Echo: $input.process()"
    }

    private fun updateChatDisplay(userInput: String, botResponse: String) {
        val newChatText = "You: $userInput\nBot: $botResponse\n\n${chatDisplay.text}"
        chatDisplay.text = newChatText
    }
}
