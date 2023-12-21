import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final int DATABASE_VERSION = 1;
    private static final String DATABASE_NAME = "stickyNotes.db";
    private static final String TABLE_NOTES = "notes";

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String CREATE_NOTES_TABLE = "CREATE TABLE " + TABLE_NOTES + "("
                + "id INTEGER PRIMARY KEY," + "note TEXT)";
        db.execSQL(CREATE_NOTES_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // Drop older notes table if existed
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_NOTES);

        // Create tables again
        onCreate(db);

        // Add new column to notes table
        db.execSQL("ALTER TABLE " + TABLE_NOTES + " ADD COLUMN note_color INTEGER DEFAULT 0");

        // Add new table for goals
        String CREATE_GOALS_TABLE = "CREATE TABLE " + TABLE_GOALS + "("
                + "id INTEGER PRIMARY KEY," + "goal TEXT)";

        // Add new table for reminders
        String CREATE_REMINDERS_TABLE = "CREATE TABLE " + TABLE_REMINDERS + "("
                + "id INTEGER PRIMARY KEY," + "reminder TEXT)";

        // Add new table for mood
        String CREATE_MOOD_TABLE = "CREATE TABLE " + TABLE_MOOD + "("
                + "id INTEGER PRIMARY KEY," + "mood TEXT)";

        // Add new table for weather
        String CREATE_WEATHER_TABLE = "CREATE TABLE " + TABLE_WEATHER + "("
                + "id INTEGER PRIMARY KEY," + "weather TEXT)";

        // Add new table for location
        String CREATE_LOCATION_TABLE = "CREATE TABLE " + TABLE_LOCATION + "("
                + "id INTEGER PRIMARY KEY," + "location TEXT)";

        // Add new table for date
        String CREATE_DATE_TABLE = "CREATE TABLE " + TABLE_DATE + "("
                + "id INTEGER PRIMARY KEY," + "date TEXT)";

        // Add new table for time
        String CREATE_TIME_TABLE = "CREATE TABLE " + TABLE_TIME + "("
                + "id INTEGER PRIMARY KEY," + "time TEXT)";

        // Add new table for images
        String CREATE_IMAGES_TABLE = "CREATE TABLE " + TABLE_IMAGES + "("
                + "id INTEGER PRIMARY KEY," + "image TEXT)";

        // Add new table for audio
        String CREATE_AUDIO_TABLE = "CREATE TABLE " + TABLE_AUDIO + "("
                + "id INTEGER PRIMARY KEY," + "audio TEXT)";

        // Add new table for video
        String CREATE_VIDEO_TABLE = "CREATE TABLE " + TABLE_VIDEO + "("
                + "id INTEGER PRIMARY KEY," + "video TEXT)";

        // Add new table for tags
        String CREATE_TAGS_TABLE = "CREATE TABLE " + TABLE_TAGS + "("
                + "id INTEGER PRIMARY KEY," + "tag TEXT)";

        // Add new table for categories
        String CREATE_CATEGORIES_TABLE = "CREATE TABLE " + TABLE_CATEGORIES + "("
                + "id INTEGER PRIMARY KEY," + "category TEXT)";
    }

    public void getAllNotes() {
        // Select All Query
        String selectQuery = "SELECT  * FROM " + TABLE_NOTES;

        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery(selectQuery, null);

        // looping through all rows and adding to list
        if (cursor.moveToFirst()) {
            do {
                Note note = new Note();
                note.setId(Integer.parseInt(cursor.getString(0)));
                note.setNoteText(cursor.getString(1));
                // Adding note to list
                notesList.add(note);
            } while (cursor.moveToNext());
        }

        // return notes list
        return notesList;
    }

    public void addNote() {
        SQLiteDatabase db = this.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put("note", note.getNoteText()); // Note text

        // Inserting Row
        db.insert(TABLE_NOTES, null, values);
        db.close(); // Closing database connection
    }

    public void updateNote() {
        SQLiteDatabase db = this.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put("note", note.getNoteText()); // Note text

        // updating row
        db.update(TABLE_NOTES, values, "id = ?", new String[] { String.valueOf(note.getId()) });
        db.close(); // Closing database connection
    }

    public void deleteNote() {
        SQLiteDatabase db = this.getWritableDatabase();
        db.delete(TABLE_NOTES, "id = ?", new String[] { String.valueOf(note.getId()) });
        db.close();
    }

    public void deleteAllNotes() {
        SQLiteDatabase db = this.getWritableDatabase();
        db.delete(TABLE_NOTES, null, null);
        db.close();
    }

    public void getNoteCount() {
        String countQuery = "SELECT  * FROM " + TABLE_NOTES;
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.rawQuery(countQuery, null);
        int count = cursor.getCount();
        cursor.close();

        // return count
        return count;
    }

    public void addGoal() {
        SQLiteDatabase db = this.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put("goal", goal.getGoalText()); // Goal text

        // Inserting Row
        db.insert(TABLE_GOALS, null, values);
        db.close(); // Closing database connection
    }

    public void updateGoal() {
        SQLiteDatabase db = this.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put("goal", goal.getGoalText()); // Goal text

        // updating row
        db.update(TABLE_GOALS, values, "id = ?", new String[] { String.valueOf(goal.getId()) });
        db.close(); // Closing database connection
    }

}
