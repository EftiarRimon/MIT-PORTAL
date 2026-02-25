import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState('add');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // New teacher form — designation and role are fixed, not shown as inputs
  const [form, setForm] = useState({ email: '', name: '', password: '', coursecode: '' });

  // Assign course form
  const [assignEmail, setAssignEmail] = useState('');
  const [assignCode, setAssignCode] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [tRes, cRes] = await Promise.all([
        axios.get('http://localhost:5000/api/teachers', { headers }),
        axios.get('http://localhost:5000/api/courses-list', { headers }),
      ]);
      setTeachers(tRes.data);
      setCourses(cRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/teachers', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg({ type: 'success', text: 'Teacher created successfully!' });
      setForm({ email: '', name: '', password: '', coursecode: '' });
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to create teacher.' });
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/teachers/${encodeURIComponent(assignEmail)}/assign-course`,
        { coursecode: assignCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg({ type: 'success', text: 'Course assigned successfully!' });
      setAssignEmail('');
      setAssignCode('');
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to assign course.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Manage Course Teachers</h1>
          <p className="text-slate-500 mt-1">Add new teachers or assign courses to existing ones</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: 'add', label: 'Add New Teacher' }, { key: 'assign', label: 'Assign Course to Existing' }].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setMsg(null); }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                tab === t.key ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {msg.text}
          </div>
        )}

        {/* Add New Teacher */}
        {tab === 'add' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
            <h2 className="font-semibold text-slate-700 text-lg mb-5">New Teacher Details</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Dr. John Smith"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email *</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="teacher@example.com"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Designation</label>
                <input
                  type="text"
                  value="Course Teacher"
                  disabled
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                <input
                  type="text"
                  value="Course Teacher"
                  disabled
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Password *</label>
                <input
                  type="password" required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Set initial password"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Assign Course</label>
                <select
                  value={form.coursecode}
                  onChange={e => setForm({ ...form, coursecode: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">-- Select a course (optional) --</option>
                  {courses.map(c => (
                    <option key={c.coursecode} value={c.coursecode}>
                      {c.coursecode} — {c.coursename}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition"
                >
                  Create Teacher
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assign Course to Existing Teacher */}
        {tab === 'assign' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
            <h2 className="font-semibold text-slate-700 text-lg mb-5">Assign Course to Existing Teacher</h2>
            <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Select Teacher *</label>
                <select
                  required
                  value={assignEmail}
                  onChange={e => setAssignEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map(t => (
                    <option key={t.email} value={t.email}>
                      {t.name} {t.coursecode ? `(currently: ${t.coursecode})` : '(no course)'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Assign Course *</label>
                <select
                  required
                  value={assignCode}
                  onChange={e => setAssignCode(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">-- Select Course --</option>
                  {courses.map(c => (
                    <option key={c.coursecode} value={c.coursecode}>
                      {c.coursecode} — {c.coursename}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition"
                >
                  Assign Course
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Teachers Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 text-lg">All Course Teachers</h2>
          </div>
          {loading ? (
            <div className="p-6 text-slate-400 animate-pulse">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">Designation</th>
                  <th className="text-left px-6 py-3">Assigned Course</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-6 text-center text-slate-400">No course teachers found.</td></tr>
                ) : teachers.map(t => (
                  <tr key={t.email}>
                    <td className="px-6 py-3 font-medium text-slate-800">{t.name}</td>
                    <td className="px-6 py-3 text-slate-600">{t.email}</td>
                    <td className="px-6 py-3 text-slate-600">{t.designation || 'Course Teacher'}</td>
                    <td className="px-6 py-3">
                      {t.coursecode
                        ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{t.coursecode}</span>
                        : <span className="text-slate-400 text-xs">Not assigned</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}