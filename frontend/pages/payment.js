import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Payment() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [feeBreakdown, setFeeBreakdown] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/dashboard/student-info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentInfo(data);

        // Fetch fee breakdown
        const feeRes = await axios.get(
          `http://localhost:5000/api/payment/fee-breakdown/${data.registration_number}/${data.currentSemester}/${data.session}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFeeBreakdown(feeRes.data);

        // Fetch payment status
        const statusRes = await axios.get(
          `http://localhost:5000/api/payment/status/${data.registration_number}/${data.currentSemester}/${data.session}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPaymentStatus(statusRes.data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId) return setMessage({ type: 'error', text: 'Please enter a transaction ID.' });
    setSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('registration_number', studentInfo.registration_number);
      formData.append('semester', studentInfo.currentSemester);
      formData.append('session', studentInfo.session);
      formData.append('transaction_id', transactionId);
      formData.append('total_amount', feeBreakdown.totalFee);
      if (receipt) formData.append('receipt', receipt);

      await axios.post('http://localhost:5000/api/payment/submit', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      setPaymentStatus('pending');
      setMessage({ type: 'success', text: 'Payment submitted! Awaiting staff verification.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Submission failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const downloadSlip = () => {
    const { registration_number, currentSemester, session } = studentInfo;
    window.open(
      `http://localhost:5000/api/paymentSlip/${registration_number}/${currentSemester}/${session}`,
      '_blank'
    );
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    verified: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusLabel = {
    pending: '⏳ Pending Verification',
    verified: '✅ Payment Verified',
    rejected: '❌ Payment Rejected',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 text-lg animate-pulse">Loading payment details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Payment</h1>
          {studentInfo && (
            <p className="text-slate-500 mt-1">
              {studentInfo.name} &middot; {studentInfo.registration_number} &middot; Semester {studentInfo.currentSemester}
            </p>
          )}
        </div>

        {/* Payment Status Banner */}
        {paymentStatus && paymentStatus !== 'not_submitted' && (
          <div className={`border rounded-xl px-5 py-4 mb-6 font-semibold text-sm ${statusColor[paymentStatus]}`}>
            {statusLabel[paymentStatus]}
          </div>
        )}

        {/* Fee Breakdown */}
        {feeBreakdown && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-700 text-lg">Fee Breakdown</h2>
              <button
                onClick={downloadSlip}
                className="text-sm bg-slate-800 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700 transition"
              >
                ↓ Download PDF Slip
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3">Particulars</th>
                  <th className="text-right px-6 py-3">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-3 text-slate-700">Semester Fee</td>
                  <td className="px-6 py-3 text-right text-slate-700">10,000</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-slate-700">Lab Usage Fee</td>
                  <td className="px-6 py-3 text-right text-slate-700">8,000</td>
                </tr>
                {feeBreakdown.courseFees.map((cf, i) => (
                  <tr key={i}>
                    <td className="px-6 py-3 text-slate-700">
                      {cf.coursename}
                      <span className="ml-2 text-xs text-slate-400">({cf.credit} credits × ৳4,500)</span>
                    </td>
                    <td className="px-6 py-3 text-right text-slate-700">{cf.fee.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-800 text-white">
                <tr>
                  <td className="px-6 py-4 font-bold text-lg">Total</td>
                  <td className="px-6 py-4 text-right font-bold text-lg">
                    ৳{feeBreakdown.totalFee.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Submit Payment — only show if not yet submitted/verified */}
        {(!paymentStatus || paymentStatus === 'not_submitted' || paymentStatus === 'rejected') && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-6">
            <h2 className="font-semibold text-slate-700 text-lg mb-5">Submit Payment Proof</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Transaction ID *</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. TXN123456789"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Upload Bank Receipt <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setReceipt(e.target.files[0])}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>

              {message && (
                <div className={`text-sm px-4 py-3 rounded-lg ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Payment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}