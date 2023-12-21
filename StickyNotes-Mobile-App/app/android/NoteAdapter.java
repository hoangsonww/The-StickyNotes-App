import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import java.util.List;

public class NoteAdapter extends BaseAdapter {
    private List<Note> notes;

    public NoteAdapter(List<Note> notes) {
        this.notes = notes;
    }

    @Override
    public int getCount() {
        return notes.size();
    }

    @Override
    public Object getItem(int position) {
        return notes.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(parent.getContext()).inflate(R.layout.note_item, parent, false);
        }

        TextView noteText = convertView.findViewById(R.id.noteText);
        noteText.setText(notes.get(position).getText());

        return convertView;
    }

    @Override
    public void notifyDataSetChanged() {
        super.notifyDataSetChanged();
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
        notifyDataSetChanged();
    }

    public void add(Note note) {
        notes.add(note);
        notifyDataSetChanged();
    }

    public void remove(Note note) {
        notes.remove(note);
        notifyDataSetChanged();
    }

    public void clear() {
        notes.clear();
        notifyDataSetChanged();
    }

    public void update(Note note) {
        int index = notes.indexOf(note);
        if (index != -1) {
            notes.set(index, note);
            notifyDataSetChanged();
        }
    }

    public void update(int index, Note note) {
        notes.set(index, note);
        notifyDataSetChanged();
    }

    public Note get(int index) {
        return notes.get(index);
    }

    public List<Note> getAll() {
        return notes;
    }

    public int indexOf(Note note) {
        return notes.indexOf(note);
    }

    public boolean contains(Note note) {
        return notes.contains(note);
    }

    public boolean isEmpty() {
        return notes.isEmpty();
    }

    public boolean remove(int index) {
        if (index >= 0 && index < notes.size()) {
            notes.remove(index);
            notifyDataSetChanged();
            return true;
        }
        return false;
    }

    public boolean remove(Note note) {
        if (notes.contains(note)) {
            notes.remove(note);
            notifyDataSetChanged();
            return true;
        }
        return false;
    }

    public boolean removeAll(List<Note> notes) {
        if (this.notes.containsAll(notes)) {
            this.notes.removeAll(notes);
            notifyDataSetChanged();
            return true;
        }
        return false;
    }

    public boolean addAll(List<Note> notes) {
        if (this.notes.addAll(notes)) {
            notifyDataSetChanged();
            return true;
        }
        return false;
    }

    public boolean addAll(int index, List<Note> notes) {
        if (this.notes.addAll(index, notes)) {
            notifyDataSetChanged();
            return true;
        }
        return false;
    }

    public boolean containsAll(List<Note> notes) {
        return this.notes.containsAll(notes);
    }

    public boolean retainAll(List<Note> notes) {
        if (this.notes.retainAll(notes)) {
            notifyDataSetChanged();
            return true;
        }
        return false;
    }

    public void replaceAll(List<Note> notes) {
        this.notes.clear();
        this.notes.addAll(notes);
        notifyDataSetChanged();
    }

    public void sort(Comparator<? super Note> comparator) {
        Collections.sort(notes, comparator);
        notifyDataSetChanged();
    }

    public void shuffle() {
        Collections.shuffle(notes);
        notifyDataSetChanged();
    }

    public void shuffle(Random random) {
        Collections.shuffle(notes, random);
        notifyDataSetChanged();
    }

    public void reverse() {
        Collections.reverse(notes);
        notifyDataSetChanged();
    }

    public void swap(int index1, int index2) {
        Collections.swap(notes, index1, index2);
        notifyDataSetChanged();
    }

    public void rotate(int distance) {
        Collections.rotate(notes, distance);
        notifyDataSetChanged();
    }

    public void clear() {
        notes.clear();
        notifyDataSetChanged();
    }

    public void add(Note note) {
        notes.add(note);
        notifyDataSetChanged();
    }

    public void add(int index, Note note) {
        notes.add(index, note);
        notifyDataSetChanged();
    }

    public void addAll(List<Note> notes) {
        notes.addAll(notes);
        notifyDataSetChanged();
    }

    public void addAll(int index, List<Note> notes) {
        notes.addAll(index, notes);
        notifyDataSetChanged();
    }

    public void remove(Note note) {
        notes.remove(note);
        notifyDataSetChanged();
    }

    public void remove(int index) {
        notes.remove(index);
        notifyDataSetChanged();
    }
}
