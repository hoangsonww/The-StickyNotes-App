import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.widget.Toast;

public class ReminderService extends Service {

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Toast.makeText(this, "Reminder!", Toast.LENGTH_LONG).show();
        return START_STICKY;
    }
}
