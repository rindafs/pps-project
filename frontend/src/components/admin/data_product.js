import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function GetProduct() {
  const [products, setProducts] = useState([]); // State to store products
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    setIsModalOpen(true);
    if (product) {
      setIsEditMode(true);
      setCurrentProductId(product.id);
      setNama(product.nama);
      setHarga(product.harga);
      setDeskripsi(product.deskripsi);
      setGambar(product.gambar);
    } else {
      setIsEditMode(false);
      setNama("");
      setHarga("");
      setDeskripsi("");
      setGambar("");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentProductId(null);
    setNama("");
    setHarga("");
    setDeskripsi("");
    setGambar("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append("nama", nama);
    productData.append("harga", harga);
    productData.append("deskripsi", deskripsi);
    productData.append("gambar", gambar);

    try {
      if (isEditMode) {
        // Update data pengguna
        await axios.put(
          `http://localhost:8000/products/${currentProductId}`,
          productData
        );
        setProducts(
          products.map((product) =>
            product.id === currentProductId
              ? { ...product, nama, harga, deskripsi, gambar }
              : product
          )
        );
      } else {
        // Tambah pengguna baru
        const response = await axios.post(
          "http://localhost:8000/products",
          productData
        );
        setProducts([...products, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

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
          await axios.delete(`http://localhost:8000/products/${id}`);
          setProducts(products.filter((product) => product.id !== id));
          Swal.fire("Terhapus!", "Data product berhasil dihapus.", "success");
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Gagal!", "Data pengguna gagal dihapus.", "error");
        }
      }
    });
  };

  return (
    <div className="flex flex-col mt-2">
      <div className="overflow-x-auto">
        <button
          type="button"
          onClick={() => openModal()}
          className="inline-flex items-center ml-0 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Tambah
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-[400px] rounded-lg p-4">
              <div className="text-center text-[#192a56] text-xl font-bold mb-4"></div>
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
                    htmlFor="harga"
                  >
                    Harga
                  </label>
                  <input
                    type="harga"
                    id="harga"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Masukkan harga"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold"
                    htmlFor="deskripsi"
                  >
                    Deskripsi
                  </label>
                  <input
                    type="deskripsi"
                    id="deskripsi"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Masukkan deskripsi"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold"
                    htmlFor="gambar"
                  >
                    Gambar
                  </label>
                  <input
                    type="file"
                    id="gambar"
                    onChange={(e) => setGambar(e.target.files[0])} // Ambil file pertama yang dipilih
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  />
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
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow mt-2">
            <table className="min-w-[1100px] max-w-[100%] mx-auto divide-y divide-gray-200 table-fixed dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[200px]"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[250px]"
                  >
                    Harga
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[100px]"
                  >
                    Deskripsi
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400 min-w-[150px]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {product.nama}
                      </div>
                    </td>
                    <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      Rp {product.harga}
                    </td>
                    <td className="p-4 text-base font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {product.deskripsi}
                    </td>
                    <td className="p-4 space-x-2 whitespace-nowrap">
                      <div className="flex justify-end space-x-4 ml-10">
                        <button
                          type="button"
                          onClick={() => openModal(product)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                        >
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

export default GetProduct;
