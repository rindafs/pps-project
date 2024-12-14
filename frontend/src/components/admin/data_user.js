import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function GetUser() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    setIsModalOpen(true);
    if (user) {
      setIsEditMode(true);
      setCurrentUserId(user.id);
      setNama(user.nama);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setIsEditMode(false);
      setNama("");
      setEmail("");
      setPassword("");
      setRole("");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentUserId(null);
    setNama("");
    setEmail("");
    setPassword("");
    setRole("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { nama, email, password, role };

    try {
      if (isEditMode) {
        // Update data pengguna
        await axios.put(
          `http://localhost:8000/users/${currentUserId}`,
          userData
        );
        setUsers(
          users.map((user) =>
            user.id === currentUserId ? { ...user, nama, email, role } : user
          )
        );
      } else {
        // Tambah pengguna baru
        const response = await axios.post(
          "http://localhost:8000/users",
          userData
        );
        setUsers([...users, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data pengguna akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/users/${id}`);
          setUsers(users.filter((user) => user.id !== id));
          Swal.fire("Terhapus!", "Data pengguna berhasil dihapus.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Gagal!", "Data pengguna gagal dihapus.", "error");
        }
      }
    });
  };

  return (
    <div className="flex flex-col mt-10">
      <div className="overflow-x-auto">
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center ml-24 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Tambah
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-[400px] rounded-lg p-4">
              <div className="text-center text-[#192a56] text-xl font-bold mb-4">
                {isEditMode ? "Edit Pengguna" : "Tambah Pengguna"}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold" htmlFor="nama">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Masukkan nama"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Masukkan email"
                  />
                </div>
                {!isEditMode && (
                  <div className="mb-4">
                    <label
                      className="block text-sm font-semibold"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                      placeholder="Masukkan password"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-semibold" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Pilih Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-[#e28606] text-white px-6 py-2 rounded-md"
                  >
                    {isEditMode ? "Simpan" : "Tambah"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-6 py-2 rounded-md"
                    onClick={closeModal}
                  >
                    Tutup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="inline-block min-w-full align-middle mt-2">
          <div className="overflow-hidden shadow">
            <table className="min-w-[1100px] max-w-[100%] mx-auto divide-y divide-gray-200 table-fixed dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[200px]">
                    Nama
                  </th>
                  <th className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[250px]">
                    Email
                  </th>
                  <th className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[100px]">
                    Role
                  </th>
                  <th className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400 min-w-[200px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {user.nama}
                      </div>
                    </td>
                    <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {user.email}
                    </td>
                    <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {user.role}
                    </td>
                    <td className="p-4 space-x-2 whitespace-nowrap">
                      <div className="flex justify-end space-x-4 ml-10">
                        <button
                          type="button"
                          onClick={() => openModal(user)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Update
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H3a1 1 0 100 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-4.382l-.724-1.447A1 1 0 0011 2H9zm1 4a1 1 0 011 1v7a1 1 0 11-2 0V7a1 1 0 011-1zm-3 1a1 1 0 10-2 0v7a1 1 0 102 0V7zm8-1a1 1 0 10-2 0v7a1 1 0 102 0V7z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetUser;
