import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function PageHistory() {
  const [produk, setProduk] = useState({}); // Object untuk menyimpan produk berdasarkan id
  const [rating, setRating] = useState(0); // Rating yang dipilih
  const [foodName, setFoodName] = useState(""); // Nama makanan
  const [, setFoodImage] = useState(""); // Gambar makanan
  const [, setFoodPrice] = useState(0); // Harga makanan
  const [isModalOpen, setIsModalOpen] = useState(false); // Untuk mengontrol modal
  const [reviewText, setReviewText] = useState(""); // Teks ulasan
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Detail transaksi yang dipilih
  const [transaksi, setTransaksi] = useState([]); // Data transaksi
  const [averageRatings, setAverageRatings] = useState({}); // Rata-rata rating per produk
  const [hasReviewed, setHasReviewed] = useState(false); // Status apakah pengguna sudah memberikan review
  const userId = localStorage.getItem("user_id"); // Ambil user_id dari localStorage
  const [reviewData, setReviewData] = useState([]);
  const [reviewStatus, setReviewStatus] = useState({});

  // State untuk menyimpan item yang akan diedit dan modal visibility
  const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mengambil data transaksi
  useEffect(() => {
    axios
      .get("http://localhost:8000/transaksi")
      .then((response) => {
        console.log("Data transaksi:", response.data); // Periksa isi data
        setTransaksi(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, []);

  // Mengambil data produk berdasarkan product_id
  useEffect(() => {
    axios
      .get("http://localhost:8000/products")
      .then((response) => {
        const produkData = response.data.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        setProduk(produkData);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  // Mengambil rata-rata rating untuk produk berdasarkan transaksi
  useEffect(() => {
    const productIds = transaksi.map((item) => item.product_id);

    productIds.forEach((productId) => {
      axios
        .get(`http://localhost:8000/review/average-rating/${productId}`)
        .then((response) => {
          setAverageRatings((prevRatings) => ({
            ...prevRatings,
            [productId]: response.data.averageRating,
          }));
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the average rating!",
            error
          );
        });
    });
  }, [transaksi]);

  // Mengecek apakah pengguna sudah memberikan review untuk produk tertentu

  useEffect(() => {
    const userId = localStorage.getItem("user_id"); // Ambil user_id dari localStorage
    const fetchReviewStatus = async (productId) => {
      try {
        const response = await fetch(
          `http://localhost:8000/review/user/${userId}`
        );
        const data = await response.json();

        // Cek apakah produk sudah di-review
        const reviewedProduct = data.find(
          (item) => item.product_id === productId
        );
        if (reviewedProduct) {
          setReviewStatus((prevState) => ({ ...prevState, [productId]: true }));
        } else {
          setReviewStatus((prevState) => ({
            ...prevState,
            [productId]: false,
          }));
        }
      } catch (error) {
        console.error("Error fetching review status:", error);
      }
    };

    transaksi.forEach((item) => {
      fetchReviewStatus(item.product_id); // Panggil fetch untuk setiap produk
    });
  }, [transaksi]);

  const openRatingModal = (productId, transaction) => {
    const selectedProduct = produk[productId];
    setFoodName(selectedProduct.product_name);
    setFoodImage(selectedProduct.product_image);
    setFoodPrice(selectedProduct.product_price);
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeRatingModal = () => {
    setRating(0); // Reset rating
    setReviewText(""); // Reset review text
    setIsModalOpen(false);
    setShowEditModal(false);

    // Refresh halaman setelah modal ditutup
    window.location.reload();
  };

  // Fungsi untuk membuka modal edit
  const openEditModal = (productId, transaction) => {
    const selectedProduct = produk[productId];
    setFoodName(selectedProduct.product_name);
    setFoodImage(selectedProduct.product_image);
    setFoodPrice(selectedProduct.product_price);
    // console.log('Open edit modal for product:', productId, item);
    setSelectedItemToEdit(transaction); // Menyimpan item yang dipilih
    setShowEditModal(true); // Menampilkan modal
  };

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const submitReview = () => {
    if (rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Harap pilih rating.",
        confirmButtonText: "OK",
      });
      return;
    }
    if (!reviewText) {
      Swal.fire({
        icon: "warning",
        title: "Harap tuliskan ulasan.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Data review yang akan dikirimkan
    const reviewData = {
      product_id: selectedTransaction.product_id,
      user_id: selectedTransaction.user_id,
      rating: rating,
      comment: reviewText,
    };

    // Mengirim data ulasan ke backend
    axios
      .post("http://localhost:8000/review", reviewData)
      .then((response) => {
        console.log("Ulasan berhasil dikirim:", response.data);
        Swal.fire({
          icon: "success",
          title: "Ulasan berhasil dikirim!",
          confirmButtonText: "OK",
        });
        closeRatingModal(); // Menutup modal setelah berhasil mengirim ulasan
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengirim ulasan:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal mengirim ulasan. Coba lagi.",
          confirmButtonText: "OK",
        });
      });
  };

  // Mengambil data review berdasarkan user_id
  useEffect(() => {
    if (selectedTransaction?.user_id) {
      fetch(`http://localhost:8000/review/user/${selectedTransaction.user_id}`)
        .then((response) => response.json())
        .then((data) => {
          // Proses data yang diterima dan set ke state, misalnya:
          setReviewData(data); // Menyimpan data review ke state
        })
        .catch((error) => console.error("Error fetching review data:", error));
    }
  }, [selectedTransaction]);

  const handleSubmit = async () => {
    if (!rating || !reviewText) {
      alert("Harap isi rating dan ulasan sebelum mengirim.");
      return;
    }

    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User ID tidak ditemukan. Harap login terlebih dahulu.");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/review/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: rating,
            comment: reviewText,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error dari server:", errorData);
        alert("Gagal mengirim ulasan. Silakan coba lagi.");
        return;
      }

      const result = await response.json();
      // console.log("Ulasan berhasil dikirim:", result);
      // Gunakan SweetAlert untuk pesan sukses
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Ulasan Anda berhasil dikirim.",
      }).then(() => {
        // Tutup modal setelah pengguna menutup SweetAlert
        closeRatingModal();
      });
    } catch (error) {
      console.error("Kesalahan saat mengirim ulasan:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const DeleteReview = async (productId) => {
    // Ambil user_id dari localStorage
    const userId = localStorage.getItem("user_id"); // Pastikan user_id ada di localStorage

    if (!userId) {
      // Jika user_id tidak ada di localStorage, tampilkan pesan kesalahan menggunakan SweetAlert
      Swal.fire({
        icon: "error",
        title: "User ID tidak ditemukan",
        text: "User ID tidak ditemukan di localStorage.",
      });
      return;
    }

    try {
      // Mengirimkan request DELETE ke endpoint yang sesuai
      const response = await axios.delete(
        `http://localhost:8000/review/${userId}/${productId}`
      );

      // Menampilkan SweetAlert jika berhasil
      Swal.fire({
        icon: "success",
        title: "Review berhasil dihapus",
        text: response.data.message,
      }).then(() => {
        // Tutup modal setelah pengguna menutup SweetAlert
        closeRatingModal();
      });
    } catch (error) {
      // Menampilkan SweetAlert jika terjadi error
      Swal.fire({
        icon: "error",
        title: "Gagal menghapus review",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus review",
      });
      console.error("Error:", error);
    }
  };

  if (transaksi.length === 0 || Object.keys(produk).length === 0)
    return <div>Loading...</div>;

  return (
    <div className="w-[1450px] h-[900px] relative">
      <div className="w-[1512px] h-[1524px] left-0 top-[0px] absolute bg-[#eeeeee]">
        <div className="w-[1200px] h-[1524px] left-[40px]">
          <div className="mt-10">
            <div className="w-[191px] h-[27px] ml-[530px] top-[10px] text-center text-[#e28606] text-[40px] font-bold font-['Nunito'] capitalize">
              History
            </div>
          </div>

          {localStorage.getItem("token") &&
            transaksi.map((item) => {
              const product = produk[item.product_id];
              if (!product) return null; // Jika produk tidak ditemukan, jangan tampilkan apa pun

              const averageRating = averageRatings[item.product_id] || 0; // Ambil rata-rata rating, default 0 jika tidak ada

              // if (item.keterangan !== 1) return null; // Hanya render transaksi dengan keterangan === 1

              return (
                <div className="mt-10" key={item.id}>
                  <div className="w-[1080px] h-[360px] bg-white rounded-[5px] shadow border border-black/20 relative mt-[10px] ml-[90px]">
                    {/* Render Bintang Rating */}
                    <div className="absolute top-[251px] right-20 flex space-x-1">
                      {[...Array(5)].map((_, index) => {
                        const rating = averageRatings[product.id]; // Ambil rating untuk produk
                        if (rating === undefined) return null; // Jangan tampilkan bintang jika rating belum tersedia

                        const isFullStar = rating >= index + 1;
                        const isHalfStar = !isFullStar && rating > index;

                        return (
                          <i
                            key={index}
                            className={`fas fa-star ${
                              isFullStar
                                ? "text-[#e28606]"
                                : isHalfStar
                                ? "text-[#e28606] text-opacity-50"
                                : "text-gray-400"
                            }`}
                          ></i>
                        );
                      })}
                    </div>

                    {/* Nama Produk */}
                    <div className="absolute w-[170.72px] h-[34px] text-[#192a56] text-[20px] font-bold font-['Nunito'] capitalize top-[307px] left-[50px]">
                      {product.nama}
                    </div>

                    {/* Keterangan dan Tanggal */}
                    <div className="absolute w-[316px] h-[34px] text-[#192a56] text-xl font-normal font-['Nunito'] capitalize top-[39px] left-[418px]">
                      {item.keterangan === 0
                        ? "Cancelled"
                        : item.keterangan === 1
                        ? "Delivered"
                        : ""}{" "}
                      &nbsp;
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    {/* Harga Produk */}
                    <div className="absolute w-40 h-[34px] text-[#e28606] text-[25px] font-normal font-['Nunito'] capitalize top-[39px] right-[50px]">
                      Rp {product.harga}
                    </div>

                    {/* Gambar Produk */}
                    <div className="absolute w-[328px] h-[252px] top-[39px] left-[50px]">
                      <img
                        id="foodImage"
                        className="w-full h-full object-cover rounded-[5px]"
                        src={`http://localhost:8000/uploads/${product.gambar}`}
                        alt="Food"
                      />
                    </div>

                    {/* Tombol Berdasarkan Status */}
                    {item.keterangan === 1 && (
                      <div key={item.product_id}>
                        {/* Tombol "View Rating & Review" jika belum di-review */}
                        {!reviewStatus[item.product_id] && (
                          <div
                            className="absolute w-[214px] h-[39px] bg-[#192a56] rounded-[5px] cursor-pointer top-[252px] left-[418px]"
                            onClick={() =>
                              openRatingModal(item.product_id, item)
                            }
                          >
                            <div className="w-[202px] h-[23px] text-white text-xl font-normal font-['Nunito'] capitalize text-center pt-2">
                              Give Rating & Review
                            </div>
                          </div>
                        )}

                        {/* Tombol "Review" jika produk sudah di-review */}
                        {reviewStatus[item.product_id] && (
                          <div
                            className="absolute w-[214px] h-[39px] bg-[#192a56] rounded-[5px] cursor-pointer top-[252px] left-[418px]"
                            onClick={() => openEditModal(item.product_id, item)}
                          >
                            <div className="w-[202px] h-[23px] text-white text-xl font-normal font-['Nunito'] capitalize text-center pt-2">
                              View Rating & Review
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Modal Edit Review */}
                  {showEditModal &&
                    selectedItemToEdit &&
                    selectedItemToEdit.product_id === item.product_id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white w-[800px] h-[400px] rounded-lg p-4 flex">
                          <div className="w-[50%] pr-4">
                            <div className="text-center text-[#192a56] text-xl font-bold mb-2">
                              Review
                            </div>
                            <img
                              id="modalFoodImage"
                              className="w-[328px] h-[252px] mx-auto rounded-[5px]"
                              src={`http://localhost:8000/uploads/${
                                produk[selectedItemToEdit.product_id]?.gambar
                              }`}
                              alt="Food"
                            />
                            <div
                              id="modalFoodTitle"
                              className="text-center text-[#192a56] text-xl font-bold mt-2"
                            >
                              {foodName}
                            </div>
                            <div
                              id="modalDeliveryStatus"
                              className="w-full text-left text-lg font-semibold text-[#e28606] mt-2 pl-4"
                            >
                              {selectedItemToEdit?.created_at
                                ? new Date(
                                    selectedItemToEdit.created_at
                                  ).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Tanggal tidak tersedia"}
                            </div>
                          </div>

                          <div className="w-[50%] pl-4">
                            <h3 className="text-lg font-semibold">
                              Berikan Rating:
                            </h3>
                            <div className="flex space-x-2 mt-2">
                              {[1, 2, 3, 4, 5].map((index) => (
                                <span
                                  key={index}
                                  className={`cursor-pointer text-2xl ${
                                    rating >= index
                                      ? "text-[#e28606]"
                                      : "text-gray-400"
                                  }`} // Tambahkan default color (text-gray-400) untuk bintang yang belum dipilih
                                  onClick={() => handleRating(index)}
                                >
                                  &#9733; {/* Bintang */}
                                </span>
                              ))}
                            </div>

                            <textarea
                              className="mt-4 w-full p-2 border border-gray-300 rounded-md"
                              rows="4"
                              placeholder="Tulis ulasan Anda"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                            ></textarea>

                            <div className="flex justify-between mt-4">
                              <button
                                className="bg-red-500 text-white px-6 py-2 rounded-md"
                                onClick={() => DeleteReview(item.product_id)} // Panggil DeleteReview dengan product.id
                              >
                                Delete
                              </button>

                              <button
                                className="bg-[#192a56] text-white px-6 py-2 rounded-md ml-0"
                                onClick={handleSubmit}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              );
            })}

          {isModalOpen && selectedTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white w-[800px] h-[400px] rounded-lg p-4 flex">
                <div className="w-[50%] pr-4">
                  <div className="text-center text-[#192a56] text-xl font-bold mb-2">
                    Review
                  </div>
                  <img
                    id="modalFoodImage"
                    className="w-[328px] h-[252px] mx-auto rounded-[5px]"
                    src={`http://localhost:8000/uploads/${
                      produk[selectedTransaction.product_id]?.gambar
                    }`}
                    alt="Food"
                  />
                  <div
                    id="modalFoodTitle"
                    className="text-center text-[#192a56] text-xl font-bold mt-2"
                  >
                    {foodName}
                  </div>
                  <div
                    id="modalDeliveryStatus"
                    className="w-full text-left text-lg font-semibold text-[#e28606] mt-2 pl-4"
                  >
                    {selectedTransaction?.created_at
                      ? new Date(
                          selectedTransaction.created_at
                        ).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Tanggal tidak tersedia"}
                  </div>
                </div>

                <div className="w-[50%] pl-4">
                  <h3 className="text-lg font-semibold">Berikan Rating:</h3>
                  <div className="flex space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <span
                        key={index}
                        className={`cursor-pointer text-2xl ${
                          rating >= index ? "text-[#e28606]" : "text-gray-400"
                        }`} // Tambahkan default color (text-gray-400) untuk bintang yang belum dipilih
                        onClick={() => handleRating(index)}
                      >
                        &#9733; {/* Bintang */}
                      </span>
                    ))}
                  </div>

                  <textarea
                    className="mt-4 w-full p-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Tulis ulasan Anda"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>

                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-[#e28606] text-white px-6 py-2 rounded-md"
                      onClick={submitReview}
                    >
                      Kirim Ulasan
                    </button>
                    <button
                      className="bg-gray-500 text-white px-6 py-2 rounded-md"
                      onClick={closeRatingModal}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageHistory;
