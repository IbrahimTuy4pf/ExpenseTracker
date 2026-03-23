import React, { useEffect, useState } from "react";
import Info from "../components/info";
import { userAPI } from "../services/api";
import useStore from "../store";

const Settings = () => {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    country: "",
    currency: "USD",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setUserData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        contact: user.contact || "",
        country: user.country || "",
        currency: user.currency || "USD",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = await userAPI.updateUser(userData);
      if (data.status === "success") {
        setUser(data.user, localStorage.getItem("token"));
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const data = await userAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      if (data.status === "success") {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to change password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-0 md:px-5 2xl:px-20'>
      <Info title='Settings' subTitle='Manage your account settings' />

      <div className='flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl'>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 font-semibold rounded-lg transition-all ${
            activeTab === "profile"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-6 py-3 font-semibold rounded-lg transition-all ${
            activeTab === "password"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          Password
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === "success"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {activeTab === "profile" && (
        <div className='glass rounded-2xl p-8 md:p-10 border border-white/20 shadow-xl animate-fade-in'>
          <h2 className='text-3xl font-extrabold mb-8 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent'>
            Profile Information
          </h2>
          <form onSubmit={handleUpdateProfile}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  First Name
                </label>
                <input
                  type='text'
                  required
                  value={userData.firstname}
                  onChange={(e) =>
                    setUserData({ ...userData, firstname: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Last Name
                </label>
                <input
                  type='text'
                  value={userData.lastname}
                  onChange={(e) =>
                    setUserData({ ...userData, lastname: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  value={userData.email}
                  disabled
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                />
                <p className='text-xs text-gray-500 mt-1'>Email cannot be changed</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Contact
                </label>
                <input
                  type='text'
                  value={userData.contact}
                  onChange={(e) =>
                    setUserData({ ...userData, contact: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Country
                </label>
                <input
                  type='text'
                  value={userData.country}
                  onChange={(e) =>
                    setUserData({ ...userData, country: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Currency
                </label>
                <select
                  value={userData.currency}
                  onChange={(e) =>
                    setUserData({ ...userData, currency: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                >
                  <option value='USD'>USD</option>
                  <option value='EUR'>EUR</option>
                  <option value='GBP'>GBP</option>
                  <option value='JPY'>JPY</option>
                  <option value='CAD'>CAD</option>
                </select>
              </div>
            </div>
            <div className='mt-6'>
              <button
                type='submit'
                disabled={loading}
                className='px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50'
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "password" && (
        <div className='glass rounded-2xl p-8 md:p-10 border border-white/20 shadow-xl animate-fade-in'>
          <h2 className='text-3xl font-extrabold mb-8 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent'>
            Change Password
          </h2>
          <form onSubmit={handleChangePassword}>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Current Password
                </label>
                <input
                  type='password'
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Confirm New Password
                </label>
                <input
                  type='password'
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                />
              </div>
            </div>
            <div className='mt-6'>
              <button
                type='submit'
                disabled={loading}
                className='px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50'
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;

