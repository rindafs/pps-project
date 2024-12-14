import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Registrasi() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user"); // default role
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Untuk navigasi setelah registrasi

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validasi form
    if (!nama || !email || !password) {
      setError("Semua field harus diisi");
      return;
    }

    const userData = {
      nama,
      email,
      password,
      role,
    };

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect ke halaman login setelah berhasil registrasi
        navigate("/login"); // Gunakan navigate untuk berpindah halaman
      } else {
        setError(data.message || "Terjadi kesalahan, coba lagi.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1
          className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl"
          style={{ color: "#e28606" }}
        >
          Registrasi Akun
        </h1>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Bergabunglah untuk pengalaman memesan makanan yang praktis dan
          menyenangkan.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">
            Masukan Akun Anda Dengan Benar
          </p>

          {/* Input Nama */}
          <div>
            <label htmlFor="nama" className="sr-only">
              Nama
            </label>
            <div className="relative">
              <input
                type="text"
                id="nama"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
          </div>

          {/* Input Email */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Tampilkan error jika ada */}
          {error && <p className="text-center text-red-500">{error}</p>}

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            style={{ backgroundColor: "#e28606", color: "white" }}
          >
            Registrasi
          </button>

          <p className="text-center text-sm text-gray-500">
            Sudah Memiliki Akun ?
            <Link className="underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registrasi;
