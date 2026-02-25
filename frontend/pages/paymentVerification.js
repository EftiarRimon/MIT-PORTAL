import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionMsg, setActionMsg] = useState({});

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/payment/all?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [filter]);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/payment/verify/${id}`, { status: action }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMsg({ [id]: action === 'verified' ? '✅ Verified' : '❌ Rejected' });
      setTimeout(() => fetchPayments(), 800);
    } catch (err) {
      setActionMsg({ [id]: 'Failed' });
    }
  };

  const statusBadge = {
    pending: 'bg-yellow-100 text-yellow-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Payment Verification</h1>
          <p className="text-slate-500 mt-1">Review and verify student payment submissions</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'verified', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                filter === s ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-slate-400 animate-pulse text-center py-20">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No {filter} payments found.</div>
        ) : (
          <div className="space-y-4">
            {payments.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-slate-800 text-lg">{p.student?.name}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 space-y-0.5">
                      <div>Roll: <span className="text-slate-700 font-medium">{p.registration_number}</span></div>
                      <div>Semester: <span className="text-slate-700 font-medium">{p.semester}</span> &middot; Session: <span className="text-slate-700 font-medium">{p.session}</span></div>
                      <div>Transaction ID: <span className="text-slate-700 font-medium font-mono">{p.transaction_id}</span></div>
                      <div>Amount: <span className="text-slate-700 font-semibold">৳{Number(p.total_amount).toLocaleString()}</span></div>
                      <div>Submitted: <span className="text-slate-700">{new Date(p.submitted_at).toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* Receipt + Actions */}
                  <div className="flex flex-col gap-3 items-end">
                    {p.receipt_url && (
                      <a
                        href={`http://localhost:5000/${p.receipt_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        📎 View Receipt
                      </a>
                    )}

                    {actionMsg[p.id] ? (
                      <span className="text-sm font-semibold text-slate-600">{actionMsg[p.id]}</span>
                    ) : p.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(p.id, 'verified')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleAction(p.id, 'rejected')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}