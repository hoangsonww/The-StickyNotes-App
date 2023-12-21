import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    // UI elements
    private Button btnAddNote, btnShowWeather, btnLogMood, btnShowReminders, btnShowGoals;
    private EditText editTextNote;
    private ListView listViewNotes;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize UI elements
        btnAddNote = findViewById(R.id.btnAddNote);
        btnShowWeather = findViewById(R.id.btnShowWeather);
        btnLogMood = findViewById(R.id.btnLogMood);
        btnShowReminders = findViewById(R.id.btnShowReminders);
        btnShowGoals = findViewById(R.id.btnShowGoals);
        editTextNote = findViewById(R.id.editTextNote);
        listViewNotes = findViewById(R.id.listViewNotes);

        // Set up listeners
        setupListeners();
    }

    private void setupListeners() {
        btnAddNote.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addNewNote();
            }
        });

        btnShowWeather.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showWeather();
            }
        });

        btnLogMood.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                logMood();
            }
        });

        btnShowReminders.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showReminders();
            }
        });

        btnShowGoals.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showGoals();
            }
        });

        // Load notes from preferences
        loadNotesFromPreferences();
    }

    private void addNewNote() {
        String noteText = editTextNote.getText().toString();
        if (!noteText.isEmpty()) {
            notesList.add(noteText);
            notesAdapter.notifyDataSetChanged();

            // Save note locally
            saveNoteInPreferences(noteText);
        }
        else {
            Toast.makeText(this, "Note is empty!", Toast.LENGTH_SHORT).show();
        }
    }

    private void saveNoteInPreferences(String noteText) {
        SharedPreferences prefs = getSharedPreferences("NotesPrefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("note", noteText);
        editor.apply();
    }

    private void showWeather() {
        String weatherData = "Sunny, 24°C";
        Toast.makeText(this, "Weather: " + weatherData, Toast.LENGTH_LONG).show();
    }

    private void logMood() {
        // Show a dialog to log mood, store the response
        String mood = "Happy";
        Toast.makeText(this, "Mood logged: " + mood, Toast.LENGTH_SHORT).show();
    }

    private void showReminders() {
        // Display reminders
        ArrayList<String> reminders = new ArrayList<>();
        reminders.add("Doctor Appointment at 5 PM");
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, reminders);
        listViewNotes.setAdapter(adapter);
    }

    private void showGoals() {
        // Display goals
        ArrayList<String> goals = new ArrayList<>();
        goals.add("Complete project report");
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, goals);
        listViewNotes.setAdapter(adapter);
    }

    private void loadNotesFromPreferences() {
        SharedPreferences prefs = getSharedPreferences("NotesPrefs", Context.MODE_PRIVATE);
        String note = prefs.getString("note", "");
        if (!note.isEmpty()) {
            notesList.add(note);
            notesAdapter.notifyDataSetChanged();
        }
    }

}
