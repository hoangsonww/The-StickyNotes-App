import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity
import com.example.stickynotes.R

class TaskListActivity : AppCompatActivity() {

    private lateinit var taskListView: ListView
    private var taskList: MutableList<String> = mutableListOf()
    private var taskList2: MutableList<String> = mutableListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_task_list)

        taskListView = findViewById(R.id.taskListView)
        loadTasks()
        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, taskList)
        taskListView.adapter = adapter

        taskListView.setOnItemClickListener { _, _, position, _ ->
            taskList.removeAt(position)
            adapter.notifyDataSetChanged()
        }

        taskListView.setOnItemLongClickListener { _, _, position, _ ->
            taskList.add(position, taskList[position])
            adapter.notifyDataSetChanged()
            true
        }
    }

    private fun loadTasks() {
        taskList.clear()
        taskList.addAll(listOf("Task 1", "Task 2", "Task 3"))
    }
}
