import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './layouts/home.js';
import DetailMenu from './layouts/detailmenu.js';
import History from './layouts/history.js';
import Login from './layouts/autentikasi/login.js';
import Registrasi from './layouts/autentikasi/registrasi.js';
import ProtectedRoutes from './ProtectedRoutes.js';
import '@fortawesome/fontawesome-free/css/all.css';
import DataUser from './layouts/admin/data_user.js';
import DataProduct from './layouts/admin/data_product.js';
import DataTransaksi from './layouts/admin/data_transaksi.js';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registrasi' element={<Registrasi />} />
        <Route path='/products/:productId' element={<ProtectedRoutes><DetailMenu /></ProtectedRoutes>} />
        <Route path='/history' element={<History />} />

        {/* Admin */}
        <Route path='/datauser' element={<ProtectedRoutes><DataUser /></ProtectedRoutes>} />
        <Route path='/dataproduct' element={<ProtectedRoutes><DataProduct /></ProtectedRoutes>} />
        <Route path='/datatransaksi' element={<ProtectedRoutes><DataTransaksi /></ProtectedRoutes>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
