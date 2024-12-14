import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function NavbarAdmin() {
    const [activeTab, setActiveTab] = useState('pengguna');
    const [, setIsLoggedIn] = useState(localStorage.getItem('token') !== null); // Menambahkan state isLoggedIn
    const navigate = useNavigate(); // Hook untuk navigasi

    const logout = () => {
        // Menghapus token dan data pengguna lainnya dari localStorage
        localStorage.removeItem('token');  // Menghapus token dari localStorage
        localStorage.removeItem('nama');   // Menghapus nama pengguna dari localStorage
        localStorage.removeItem('email');  // Menghapus email pengguna dari localStorage
        localStorage.removeItem('role');   // Menghapus role pengguna dari localStorage

        // Set status login ke false
        setIsLoggedIn(false);

        // Redirect ke halaman login
        window.location.href = '/login';  // Arahkan ke halaman login setelah logout
    };

    const toggleActive = (tab) => {
        setActiveTab(tab);
        if (tab === 'pengguna') {
            navigate('/datauser'); // Navigasi ke halaman /datauser ketika tab Pengguna diklik
        } if (tab === 'product') {
            navigate('/dataproduct'); // Navigasi ke halaman /history ketika tab History diklik
        } if (tab === 'transaksi') {
            navigate('/datatransaksi'); // Navigasi ke halaman /history ketika tab History diklik
        } if (tab === 'logout') {
            logout(); // Navigasi ke halaman /history ketika tab History diklik
        }
    };

    return (
        <nav className="w-full h-[65px] p-4 bg-white sm:flex items-center justify-between border-b border-gray-200 shadow lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center space-x-4">
                {/* Judul Halaman */}
                <div className="flex items-center space-x-1">
                    <span className="text-white text-[25px] font-bold font-['Nunito'] capitalize">Halaman</span>
                    <span className="text-white text-[25px] font-bold font-['Nunito'] capitalize">Admin</span>
                </div>

                {/* Tabs Pengguna dan History */}
                <div className="flex space-x-4 ml-auto mr-6">
                    <div
                        className={`w-[76px] h-[33px] ml-80 rounded-[5px] cursor-pointer flex items-center justify-center text-[17px] font-normal font-['Nunito'] capitalize ${activeTab === 'pengguna' ? 'bg-[#e28606] text-white' : 'text-[#666666]'}`}
                        onClick={() => toggleActive('pengguna')}
                    >
                        Pengguna
                    </div>
                    <div
                        className={`w-[76px] h-[33px] rounded-[5px] cursor-pointer flex items-center justify-center text-[17px] font-normal font-['Nunito'] capitalize ${activeTab === 'product' ? 'bg-[#e28606] text-white' : 'text-[#666666]'}`}
                        onClick={() => toggleActive('product')}
                    >
                        Product
                    </div>
                    <div
                        className={`w-[76px] h-[33px] rounded-[5px] cursor-pointer flex items-center justify-center text-[17px] font-normal font-['Nunito'] capitalize ${activeTab === 'transaksi' ? 'bg-[#e28606] text-white' : 'text-[#666666]'}`}
                        onClick={() => toggleActive('transaksi')}
                    >
                        Transaksi
                    </div>

                    <div
                        className={`w-[76px] h-[33px] rounded-[5px] cursor-pointer flex items-center justify-center text-[17px] font-normal font-['Nunito'] capitalize ${activeTab === 'logout' ? 'bg-[#e28606] text-white' : 'text-[#666666]'}`}
                        onClick={() => toggleActive('logout')}
                    >
                        Log Out
                    </div>
                </div>
            </div>

            {/* Breadcrumb / Navigasi Kanan */}
            <div className="flex items-center space-x-4">
                <ol className="flex items-center space-x-1 text-sm font-medium">
                    {/* Isi breadcrumb atau navigasi tambahan di sini jika diperlukan */}
                </ol>
            </div>
        </nav>
    );
}

export default NavbarAdmin;
