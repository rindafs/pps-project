import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Simpan token, nama, email, dan role pengguna ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id || "");
        localStorage.setItem("nama", data.nama || "");
        localStorage.setItem("email", data.email || "");
        localStorage.setItem("role", data.role || ""); // Menyimpan role di localStorage

        // Log untuk memastikan data tersimpan
        console.log("Data login disimpan:", {
          token: data.token,
          user_id: data.user_id,
          nama: data.nama,
          email: data.email,
          role: data.role, // Log role
        });

        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Selamat datang kembali!",
          confirmButtonText: "OK",
        });

        // Arahkan berdasarkan role pengguna
        if (data.role === "admin") {
          // Jika role adalah admin, arahkan ke /datauser
          navigate("/dataproduct");
        } else {
          // Jika bukan admin (misalnya user), arahkan ke halaman utama
          navigate("/");
        }
      } else {
        setError(data.message || "Login gagal, periksa email dan password");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan, coba lagi");
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1
          className="text-center text-2xl font-bold sm:text-3xl"
          style={{ color: "#e28606" }}
        >
          Login Akun
        </h1>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Silakan masukkan email dan password Anda untuk login.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">
            Masukkan Akun Anda Dengan Benar
          </p>

          {error && <p className="text-center text-red-500">{error}</p>}

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg px-5 py-3 text-sm font-medium"
            style={{ backgroundColor: "#e28606", color: "white" }}
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-500">
            Belum Memiliki Akun?
            <Link className="underline" to="/registrasi">
              Registrasi
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
