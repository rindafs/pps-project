import React, { useState, useEffect } from 'react';
import Symbol from '../image/Symbol.svg';
import { Link } from 'react-router-dom';

function Navbar() {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Cek login status berdasarkan token di localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // Fungsi untuk logout
    const logout = () => {
        // Menghapus token dan data pengguna lainnya dari localStorage
        localStorage.removeItem('token');  // Menghapus token dari localStorage
        localStorage.removeItem('nama');   // Menghapus nama pengguna dari localStorage
        localStorage.removeItem('email');  // Menghapus email pengguna dari localStorage
        localStorage.removeItem('role');   // Menghapus role pengguna dari localStorage

        // Set status login ke false
        setIsLoggedIn(false);

        // Redirect ke halaman login
        window.location.href = '/';  // Ubah sesuai dengan rute login Anda
    };


    return (
        <div>
            <header>
                <nav className="flex h-auto w-auto bg-white shadow-lg rounded-lg justify-between md:h-16">
                    <div className="flex w-full justify-between">
                        {/* Logo & Nama Aplikasi */}
                        <div
                            className={`flex px-6 w-1/2 items-center font-semibold md:w-1/5 md:px-1 md:flex md:items-center md:justify-center ${open ? 'hidden' : 'flex'}`}
                        >
                            <img src={Symbol} alt="Logo FastBite" className="w-6 h-6 mr-2" />
                            <a href="">FastBite</a>
                        </div>

                        {/* Menu di Mobile */}
                        <div className={`flex flex-col w-full h-auto md:hidden ${open ? 'block' : 'hidden'}`}>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Link to='/'>Menu</Link>
                                <Link to="/history">History</Link>
                                {!isLoggedIn ? (
                                    <>
                                        <Link to="/login">
                                            <button>Login</button>
                                        </Link>
                                        <Link to="/registrasi">
                                            <button>Sign Up</button>
                                        </Link>
                                    </>
                                ) : (
                                    <button onClick={logout}>Logout</button>
                                )}
                            </div>
                        </div>

                        {/* Menu di Desktop */}
                        <div className="hidden w-3/5 items-center justify-center font-semibold space-x-4 md:flex">
                            <Link to="/" className="px-3 py-1 rounded text-black hover:bg-[#E28707] active:bg-[#E28707]">
                                Menu
                            </Link>
                            <Link to="/history" className="px-3 py-1 rounded text-black hover:bg-[#E28707] active:bg-[#E28707]">
                                History
                            </Link>
                        </div>

                        {/* Login dan Sign Up di Desktop */}
                        <div className="hidden w-1/5 items-center justify-start gap-x-4 font-semibold md:flex">

                            {!isLoggedIn ? (
                                <>
                                    <Link to="/login">
                                        <button>Login</button>
                                    </Link>
                                    <Link to="/registrasi">
                                        <button>Sign Up</button>
                                    </Link>
                                </>
                            ) : (
                                <button onClick={logout}>Logout</button>
                            )}
                        </div>

                        {/* Hamburger Button */}
                        <button
                            className="text-gray-500 w-10 h-10 relative focus:outline-none bg-white md:hidden"
                            onClick={() => setOpen(!open)} // Mengubah state saat tombol diklik
                        >
                            <span className="sr-only">Open main menu</span>
                            <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span
                                    aria-hidden="true"
                                    className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? 'rotate-45' : ''} ${!open ? '-translate-y-1.5' : ''}`}
                                ></span>
                                <span
                                    aria-hidden="true"
                                    className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? 'opacity-0' : ''}`}
                                ></span>
                                <span
                                    aria-hidden="true"
                                    className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? '-rotate-45' : ''} ${!open ? 'translate-y-1.5' : ''}`}
                                ></span>
                            </div>
                        </button>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default Navbar;
