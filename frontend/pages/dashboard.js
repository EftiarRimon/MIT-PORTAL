import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [creditData, setCreditData] = useState(null);

  // Semester modal state
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [savingSemester, setSavingSemester] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data.userData);
      setError(null);

      if (response.data.userData.role === 'student') {
        fetchCreditData(token);
        checkSemester(token);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data. Please try again later.');
      router.push('/login');
    }
  };

  const checkSemester = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dashboard/student-semester`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.data.currentSemester) {
        setShowSemesterModal(true);
      }
    } catch (error) {
      console.error('Error checking semester:', error);
    }
  };

  const saveSemester = async () => {
    if (!selectedSemester) return;
    setSavingSemester(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/dashboard/student-semester`,
        { semester: selectedSemester },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(prev => ({ ...prev, currentSemester: selectedSemester }));
      setShowSemesterModal(false);
      fetchCreditData(token);
    } catch (error) {
      console.error('Error saving semester:', error);
      alert('Failed to save semester. Please try again.');
    } finally {
      setSavingSemester(false);
    }
  };

  const fetchCreditData = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/credits/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCreditData(response.data);
    } catch (error) {
      console.error('Error fetching credit data:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Error fetching notices. Please try again later.');
    }
  };

  const navigateToUploadResult = () => router.push('/uploadResult');
  const navigateToViewResult = () => router.push('/ViewResult');
  const navigateToStudentEnroll = () => router.push('/uploadEnrollment');
  const navigateToPayment = () => router.push('/payment');
  const navigateToPaymentVerification = () => router.push('/paymentVerification');
  const navigateToVerification = () => router.push('/enrollmentVerification');
  const navigateToHistory = () => router.push('/studentHistory');
  const navigateToCourseOffer = () => router.push('/courseOffer');
  const navigateToInitialCourseSelection = () => router.push('/initialCourseSelection');
  const navigateToFinalCourseEnrollment = () => router.push('/finalCourseEnrollment');

  const renderNavOptions = () => {
    switch (userData.role) {
      case 'staff':
        return (
          <>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={() => setShowNoticeForm(true)}>Notices</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToStudentEnroll}>Student Enrollment</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToPaymentVerification}>Payment Verification</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToHistory}>History</li>
          </>
        );
      case 'Course Teacher':
        return (
          <>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={fetchNotices}>Notices</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToUploadResult}>Upload Result</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={() => router.push('/finalizeCourse')}>Finalize Course</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToHistory}>History</li>
            <li onClick={() => router.push('/myCourse')}>My Course</li>
          </>
        );
      case 'Director':
        return (
          <>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={fetchNotices}>Notices</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToVerification}>Enrollment Verification</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToHistory}>History</li>
          </>
        );
      case 'Course Coordinator':
        return (
          <>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={fetchNotices}>Notices</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToVerification}>Enrollment Verification</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToCourseOffer}>Course Offer</li>
            <li onClick={() => router.push('/manageTeachers')}>Manage Teachers</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToHistory}>History</li>
          </>
        );
      case 'student':
        return (
          <>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={fetchNotices}>Notices</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToViewResult}>View Result</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToInitialCourseSelection}>Initial Course Selection</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToFinalCourseEnrollment}>Final Course Enrollment</li>
            <li className="bg-blue-700 rounded p-2 cursor-pointer" onClick={navigateToPayment}>Payment</li>
          </>
        );
      default:
        return null;
    }
  };

  const CreditProgressSection = () => {
    if (!creditData) return <p className="text-gray-400 text-sm">Loading credit data...</p>;

    const TOTAL_CREDITS = 36;
    const completed = creditData.completedCredits || 0;
    const enrolled = creditData.enrolledCredits || 0;
    const remaining = TOTAL_CREDITS - completed;
    const percentage = Math.min((completed / TOTAL_CREDITS) * 100, 100);
    const currentCourses = creditData.currentCourses || [];

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Credit Progress</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-700">{completed}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Completed</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-700">{enrolled}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Enrolled</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-700">{remaining}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Remaining</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-700">{TOTAL_CREDITS}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Total Required</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Overall Progress</span>
              <span className="font-semibold text-blue-600">{Math.round(percentage)}%</span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${percentage}%` }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400 opacity-60" style={{ left: '33.3%' }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400 opacity-60" style={{ left: '66.6%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span><span>Sem 1 (12)</span><span>Sem 2 (24)</span><span>36 cr</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-3">Current Semester Courses</h3>
          {currentCourses.length === 0 ? (
            <p className="text-gray-400 text-sm">No courses enrolled for this semester.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentCourses.map((course, idx) => (
                <div key={idx} className={`rounded-lg border p-3 ${course.status === 'finalized' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-blue-600">{course.coursecode}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${course.status === 'finalized' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {course.status === 'finalized' ? '✅ Confirmed' : '⏳ Awaiting Confirmation'}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{course.coursename}</div>
                  <div className="text-xs text-gray-500 mt-1">{course.credit} credits · {course.type}</div>
                </div>
              ))}
            </div>
          )}
          {remaining <= 6 && remaining > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              🎉 Almost there! Only <strong>{remaining} credits</strong> left to graduate.
            </div>
          )}
          {remaining === 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 font-semibold">
              🏆 Congratulations! You have completed all 36 credits!
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">

      {/* Semester Selection Modal */}
      {showSemesterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome, {userData.name}! 👋</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Please select your current semester to get started. This will be saved and you won't need to select it again.
            </p>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Semester --</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
              <option value="3rd">3rd Semester</option>
            </select>
            <button
              onClick={saveSemester}
              disabled={!selectedSemester || savingSemester}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                !selectedSemester || savingSemester
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
              }`}
            >
              {savingSemester ? 'Saving...' : 'Confirm Semester'}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="flex items-center mb-4">
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{userData.name}</h3>
            <p className="text-sm text-gray-400">{userData.email}</p>
          </div>
        </div>
        <nav>
          <ul className="space-y-2">
            {renderNavOptions()}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome, {userData.name}!</h1>
          <p className="text-gray-600">Here's your personal dashboard with important information and notices.</p>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Name</h3>
              <p className="text-gray-600">{userData.name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">{userData.email}</p>
            </div>
            {userData.role === 'student' && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Session</h3>
                  <p className="text-gray-600">{userData.session}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Semester</h3>
                  <p className="text-gray-600">
                    {userData.currentSemester
                      ? `${userData.currentSemester} Semester`
                      : <span className="text-yellow-500">Not set</span>
                    }
                  </p>
                </div>
              </>
            )}
          </div>
          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Update Profile</button>
        </div>

        {/* Credit Progress — students only */}
        {userData.role === 'student' && <CreditProgressSection />}

        {/* Notices */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Notices</h2>
          {showNoticeForm && userData.role === 'staff' ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Upload Notice</h2>
              <input
                className="w-full border rounded p-2 mb-4"
                placeholder="Title"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
              />
              <textarea
                className="w-full border rounded p-2 mb-4"
                placeholder="Description"
                rows={4}
                value={noticeDescription}
                onChange={(e) => setNoticeDescription(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    await axios.post('http://localhost:5000/api/notices',
                      { title: noticeTitle, description: noticeDescription },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert('Notice uploaded successfully');
                    setNoticeTitle('');
                    setNoticeDescription('');
                    setShowNoticeForm(false);
                  } catch (error) {
                    console.error('Error uploading notice:', error);
                    alert('Failed to upload notice');
                  }
                }}
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              {notices.map(notice => (
                <div key={notice.id} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{notice.title}</h3>
                  <p className="text-gray-600">{notice.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;