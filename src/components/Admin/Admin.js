import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const [config, setConfig] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchConfig();
    fetchUsers();
  }, []);

  const fetchConfig = async () => {
    const docRef = doc(db, 'admin-config', 'siteSettings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setConfig(docSnap.data());
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'user_data'));
    setUsers(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const handleUpdate = async () => {
    const docRef = doc(db, 'admin-config', 'siteSettings');
    await updateDoc(docRef, config);
    alert('Configuration updated!');
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, 'user_data', id));
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('landing')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'landing'
              ? 'border-b-4 border-red-500 text-red-600'
              : 'text-gray-500 hover:text-red-600'
          }`}
        >
          Landing Page
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'users'
              ? 'border-b-4 border-red-500 text-red-600'
              : 'text-gray-500 hover:text-red-600'
          }`}
        >
          All Users
        </button>
      </div>

      {/* Landing Page Config */}
      {activeTab === 'landing' && (
        <div>
          <label className="block mb-2 font-medium">Page Title</label>
          <input
            type="text"
            value={config.pageTitle || ''}
            onChange={(e) =>
              setConfig({ ...config, pageTitle: e.target.value })
            }
            className="border p-2 w-full rounded mb-4 text-black"
          />

          <h3 className="text-lg font-semibold mt-6 mb-2">Section Headings</h3>
<div className="space-y-2">
{Object.keys(config.sectionHeadings || {}).map((key) => (
  <div key={key}>
    <label className="block capitalize mb-1">{key} Section</label>
    <input
      type="text"
      value={config.sectionHeadings?.[key] || ''}
      onChange={(e) =>
        setConfig((prev) => ({
          ...prev,
          sectionHeadings: {
            ...prev.sectionHeadings,
            [key]: e.target.value
          }
        }))
      }
      className="border p-2 w-full rounded text-black"
    />
  </div>
))}
</div>


          <button
            onClick={handleUpdate}
            className="bg-red-600 text-white px-6 py-2 mt-4 rounded hover:bg-red-700"
          >
            Save Settings
          </button>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div>
          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <ul className="divide-y">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium">
                      {user.email || 'No email available'}
                    </p>
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
