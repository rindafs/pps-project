import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function GetTransaksi() {
  const [transactions, setTransaksi] = useState([]); // State untuk menyimpan data transaksi
  const [users, setUsers] = useState([]); // State untuk menyimpan data pengguna
  const [products, setProducts] = useState([]); // State untuk menyimpan data produk
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTransaksitId, setCurrentTransaksiId] = useState(null);
  const [user_id, setUser_id] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [, setProductName] = useState("");

  useEffect(() => {
    // Mengambil data transaksi, data pengguna, dan data produk dengan Axios
    const fetchData = async () => {
      try {
        // Fetch transaksi
        const transaksiResponse = await axios.get(
          "http://localhost:8000/transaksi"
        );
        setTransaksi(transaksiResponse.data); // Menyimpan data transaksi ke dalam state

        // Fetch users
        const usersResponse = await axios.get("http://localhost:8000/users");
        setUsers(usersResponse.data); // Menyimpan data pengguna ke dalam state

        // Fetch products
        const productsResponse = await axios.get(
          "http://localhost:8000/products"
        );
        setProducts(productsResponse.data); // Menyimpan data produk ke dalam state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Memanggil fungsi fetch data transaksi, pengguna, dan produk
  }, []);

  const openModal = (transactions = null) => {
    setIsModalOpen(true);
    if (transactions) {
      setIsEditMode(true);
      setCurrentTransaksiId(transactions.id);
      setUser_id(transactions.user_id);
      setProduct_id(transactions.product_id);
      setJumlah(transactions.jumlah);
      setKeterangan(transactions.keterangan);
    } else {
      setIsEditMode(false);
      setUser_id("");
      setProduct_id("");
      setJumlah("");
      setKeterangan("");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentTransaksiId(null);
    setUser_id("");
    setProduct_id("");
    setJumlah("");
    setKeterangan("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transaksiData = { user_id, product_id, jumlah, keterangan };

    try {
      if (isEditMode) {
        // Update data pengguna
        await axios.put(
          `http://localhost:8000/transaksi/${currentTransaksitId}`,
          transaksiData
        );
        setTransaksi(
          transactions.map((transaksi) =>
            transaksi.id === currentTransaksitId
              ? { ...transaksi, user_id, product_id, jumlah, keterangan }
              : transaksi
          )
        );
      } else {
        // Tambah pengguna baru
        const response = await axios.post(
          "http://localhost:8000/transaksi",
          transaksiData
        );
        setTransaksi([...transactions, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  useEffect(() => {
    const selectedProduct = products.find(
      (product) => product.id === product_id
    );
    if (selectedProduct) {
      setProductName(selectedProduct.nama);
    } else {
      setProductName("");
    }
  }, [product_id, products]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data product akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/transaksi/${id}`);
          setTransaksi(transactions.filter((transaksi) => transaksi.id !== id));
          Swal.fire("Terhapus!", "Data transaksi berhasil dihapus.", "success");
        } catch (error) {
          console.error("Error deleting transaksi:", error);
          Swal.fire("Gagal!", "Data transkasi gagal dihapus.", "error");
        }
      }
    });
  };

  return (
    <div className="flex flex-col mt-2">
      <div className="overflow-x-auto">
        {/* <button
                    type="button"
                    onClick={() => openModal()}
                    className="inline-flex items-center ml-24 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    Tambah
                </button> */}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-[400px] rounded-lg p-4">
              <div className="text-center text-[#192a56] text-xl font-bold mb-4"></div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold"
                    htmlFor="user_id"
                  >
                    user_id
                  </label>
                  <input
                    type="text"
                    id="user_id"
                    value={user_id}
                    onChange={(e) => setUser_id(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Masukkan user_id"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold"
                    htmlFor="product_id"
                  >
                    Product ID
                  </label>
                  <select
                    id="product_id"
                    value={product_id}
                    onChange={(e) => setProduct_id(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  >
                    <option value="">pilih product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.id} - {product.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold"
                    htmlFor="jumlah"
                  >
                    Jumlah
                  </label>
                  <input
                    type="jumlah"
                    id="jumlah"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Masukkan jumlah"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold"
                    htmlFor="keterangan"
                  >
                    Keterangan
                  </label>
                  <select
                    id="keterangan"
                    value={keterangan}
                    onChange={(e) => setKeterangan(Number(e.target.value))} // Konversi ke angka
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Pilih Keterangan</option>
                    <option value="0">Cancelled</option>
                    <option value="1">Delivered</option>
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
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[200px]"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[250px]"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[100px]"
                  >
                    Jumlah
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[100px]"
                  >
                    Keterangan
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400 min-w-[200px]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {transactions.map((transaksi) => {
                  // Mencari nama user berdasarkan user_id
                  const user = users.find(
                    (user) => user.id === transaksi.user_id
                  );

                  // Mencari nama produk berdasarkan product_id
                  const product = products.find(
                    (product) => product.id === transaksi.product_id
                  );

                  return (
                    <tr
                      key={transaksi.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          {user ? user.nama : "User not found"}
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {product ? product.nama : "Product not found"}{" "}
                        {/* Menampilkan nama produk */}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {transaksi.jumlah}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {transaksi.keterangan === 0
                          ? "Cancelled"
                          : transaksi.keterangan === 1
                          ? "Delivered"
                          : "Unknown"}
                      </td>

                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <div className="flex justify-end space-x-4 ml-10">
                          <button
                            type="button"
                            onClick={() => openModal(transaksi)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Update
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(transaksi.id)}
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
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetTransaksi;
