import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Pastikan mengimpor dengan benar

function ProtectedRoutes({ children }) {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
    
    // Jika tidak ada token, arahkan ke halaman login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Decode token untuk mendapatkan informasi expiry
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Waktu saat ini dalam detik

        // Cek apakah token sudah kadaluarsa
        if (decodedToken.exp < currentTime) {
            // Hapus token dari localStorage jika kadaluarsa
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        console.error("Token tidak valid", error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    // Jika token valid, render komponen anak
    return children;
}

export default ProtectedRoutes;
