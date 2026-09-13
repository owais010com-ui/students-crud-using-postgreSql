import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

function StudentForm() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        full_name: '',
        course: '',
        roll_number: '',
        age: '',
    });

    const [editForm, setEditForm] = useState({
        full_name: '',
        course: '',
        roll_number: '',
        age: '',
    });

    const getErrorMessage = (err, fallback) => {
        if (err.response) {
            return err.response.data?.message || fallback;
        } else if (err.request) {
            
            return 'Server is not responding. Is it running on port 5000?';
        } else {
            return 'Something went wrong.';
        }
    };

    const fetchStudents = useCallback(async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data);
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Could not fetch students.'));
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleAddChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/students', form);
            setForm({ full_name: '', course: '', roll_number: '', age: '' });
            setError('');
            fetchStudents();
        } catch (err) {
            setError(getErrorMessage(err, 'Could not add student.'));
        }
    };

    const startEdit = (student) => {
        setEditingId(student.id);
        setEditForm(student);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSave = async (id) => {
        try {
            await api.put(`/students/${id}`, editForm);
            setEditingId(null);
            setError('');
            fetchStudents();
        } catch (err) {
            setError(getErrorMessage(err, 'Could not update student.'));
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/students/${id}`);
            setError('');
            fetchStudents();
        } catch (err) {
            setError(getErrorMessage(err, 'Could not delete student.'));
        }
    };

    return (
        <div className="app">
            <h1>Student CRUD System</h1>

            {error && <p className="error-banner">{error}</p>}

            <form onSubmit={handleAddSubmit} className="add-form">
                <input
                    name="full_name"
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={handleAddChange}
                    required
                />
                <input
                    name="course"
                    placeholder="Course"
                    value={form.course}
                    onChange={handleAddChange}
                    required
                />
                <input
                    name="roll_number"
                    placeholder="Roll Number"
                    value={form.roll_number}
                    onChange={handleAddChange}
                    required
                />
                <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleAddChange}
                    required
                />
                <button type="submit">Add Student</button>
            </form>

            {students.length === 0 ? (
                <p className="empty-state">No students found.</p>
            ) : (
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) =>
                            editingId === s.id ? (
                                <tr key={s.id} className="editing">
                                    <td>
                                        <input
                                            name="roll_number"
                                            value={editForm.roll_number}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="full_name"
                                            value={editForm.full_name}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="course"
                                            value={editForm.course}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="age"
                                            type="number"
                                            value={editForm.age}
                                            onChange={handleEditChange}
                                        />
                                    </td>
                                    <td className="actions">
                                        <button onClick={() => handleEditSave(s.id)}>Save</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={s.id}>
                                    <td>{s.roll_number}</td>
                                    <td>{s.full_name}</td>
                                    <td>{s.course}</td>
                                    <td>{s.age}</td>
                                    <td className="actions">
                                        <button onClick={() => startEdit(s)}>Edit</button>
                                        <button onClick={() => handleDelete(s.id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default StudentForm;