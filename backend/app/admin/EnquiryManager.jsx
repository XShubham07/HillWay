'use client';
import { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaReply, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnquiryManager() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    }
    setLoading(false);
  };

  const updateEnquiryStatus = async (id, status) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        fetchEnquiries();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    
    try {
      const res = await fetch(`/api/enquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchEnquiries();
      }
    } catch (error) {
      console.error('Failed to delete enquiry:', error);
    }
  };

  const sendResponse = async () => {
    if (!responseMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/enquiries/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEnquiry._id,
          message: responseMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Response sent successfully!');
        setShowResponseModal(false);
        setResponseMessage('');
        setSelectedEnquiry(null);
        fetchEnquiries();
      } else {
        alert('Failed to send response');
      }
    } catch (error) {
      alert('Error sending response');
    }
    setSending(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'In Progress': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Contacted': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#D9A441]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Enquiries</h2>
        <div className="text-sm text-gray-400">
          Total: <span className="text-[#D9A441] font-bold">{enquiries.length}</span>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    No enquiries found
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white font-medium">{enquiry.name}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      <div>{enquiry.email}</div>
                      <div className="text-xs text-gray-500">{enquiry.contact}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{enquiry.destination}</td>
                    <td className="px-6 py-4 text-gray-300">{enquiry.duration}</td>
                    <td className="px-6 py-4">
                      <select
                        value={enquiry.status}
                        onChange={(e) => updateEnquiryStatus(enquiry._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(enquiry.status)} bg-transparent cursor-pointer`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(enquiry.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setShowResponseModal(true);
                          }}
                          className="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition"
                          title="Send Response"
                        >
                          <FaReply />
                        </button>
                        <button
                          onClick={() => deleteEnquiry(enquiry._id)}
                          className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedEnquiry && !showResponseModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
            >
              <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-8 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white">Enquiry Details</h3>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-bold">Name</label>
                      <p className="text-white font-semibold">{selectedEnquiry.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-bold">Status</label>
                      <p className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedEnquiry.status)}`}>
                        {selectedEnquiry.status}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold">Email</label>
                    <p className="text-white">{selectedEnquiry.email}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold">Contact</label>
                    <p className="text-white">{selectedEnquiry.contact}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-bold">Destination</label>
                      <p className="text-white">{selectedEnquiry.destination}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-bold">Duration</label>
                      <p className="text-white">{selectedEnquiry.duration}</p>
                    </div>
                  </div>

                  {selectedEnquiry.notes && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-bold">Additional Notes</label>
                      <p className="text-white bg-white/5 p-4 rounded-lg border border-white/10">{selectedEnquiry.notes}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold">Submitted On</label>
                    <p className="text-white">{new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Response Modal */}
      <AnimatePresence>
        {showResponseModal && selectedEnquiry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowResponseModal(false);
                setResponseMessage('');
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
            >
              <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-8 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Send Response</h3>
                    <p className="text-sm text-gray-400 mt-1">To: {selectedEnquiry.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowResponseModal(false);
                      setResponseMessage('');
                    }}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows="8"
                  placeholder="Type your response message here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowResponseModal(false);
                      setResponseMessage('');
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendResponse}
                    disabled={sending || !responseMessage.trim()}
                    className="flex-[2] px-6 py-3 bg-[#D9A441] text-black rounded-xl font-semibold hover:bg-[#fbbf24] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaReply />
                        Send Response
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}