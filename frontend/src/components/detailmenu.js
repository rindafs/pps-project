import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import TombolButton from "../image/Minus Button.svg";
import TombolButton2 from "../image/Plus Button.svg";
import "@fortawesome/fontawesome-free/css/all.css";
import gbrAkun from "../image/pic-4.png.svg";

function DetailMenu() {
  const { productId } = useParams(); // Mendapatkan productId dari URL
  const [menuDetail, setMenuDetail] = useState(null); // State untuk data detail menu
  const [quantity, setQuantity] = useState(1); // State untuk jumlah
  // const [rating, setRating] = useState(4.5); // State untuk rating bintang
  const [reviews, setReviews] = useState([]); // Inisialisasi state untuk reviews
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    // Pastikan productId ada sebelum melakukan panggilan API
    if (productId) {
      const fetchMenuDetail = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/products/${productId}`
          );
          setMenuDetail(response.data);
        } catch (error) {
          console.error("Error fetching menu detail:", error);
        }
      };

      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/review/${productId}`
          );
          const reviews = response.data;
          console.log("API Response Data (Reviews):", reviews);

          // Fetch all users to map user_id to user nama
          const usersResponse = await axios.get("http://localhost:8000/users");
          const usersData = usersResponse.data;
          console.log("API Response Data (Users):", usersData);

          // Buat dictionary untuk mencocokkan user_id dengan user.nama
          const userMap = usersData.reduce((acc, user) => {
            acc[user.id] = user.nama; // Menggunakan user.nama dari data API
            return acc;
          }, {});

          console.log("User Map:", userMap); // Log untuk memeriksa userMap

          // Update reviews untuk menggantikan user_id dengan nama pengguna dari userMap
          const updatedReviews = reviews.map((review) => ({
            ...review,
            userName: userMap[review.user_id] || "Unknown User", // Menggunakan nama atau Unknown User
          }));

          console.log("Updated Reviews with User Names:", updatedReviews);
          setReviews(updatedReviews);
        } catch (error) {
          console.error("Error fetching reviews or users:", error);
        }
      };
      const fetchAverageRating = async () => {
        try {
          // Mengambil rata-rata rating berdasarkan productId
          const response = await axios.get(
            `http://localhost:8000/review/average-rating/${productId}`
          );
          setAverageRating(response.data.averageRating); // Mengasumsikan API mengembalikan objek dengan properti averageRating
          console.log("Average Rating:", response.data.averageRating);
        } catch (error) {
          console.error("Error fetching average rating:", error);
        }
      };

      fetchAverageRating();
      fetchMenuDetail();
      fetchReviews(); // Call fetch reviews function
    } else {
      console.log("productId is not available.");
    }
  }, [productId]); // Dependencies, this will run again when productId changes

  // Fungsi untuk mengubah jumlah
  const updateQuantity = (change) => {
    let newQuantity = quantity + change;
    if (newQuantity < 1) newQuantity = 1; // Membatasi jumlah minimum menjadi 1
    setQuantity(newQuantity);
  };

  const renderStars = (rating) => {
    const totalStars = 5; // Total number of stars to display
    const stars = [];

    // Render full stars
    for (let i = 0; i < totalStars; i++) {
      const isFullStar = rating >= i + 1;
      const isHalfStar = !isFullStar && rating > i;

      stars.push(
        <i
          key={i}
          className={`fas fa-star ${
            isFullStar
              ? "text-[#e28606]" // Full star (yellow)
              : isHalfStar
              ? "text-[#e28606] text-opacity-50" // Half star (yellow with opacity)
              : "text-gray-400" // Empty star (gray)
          }`}
        ></i>
      );
    }

    return stars;
  };

  // Fungsi untuk menangani klik tombol Add to Cart dan menambahkan data transaksi
  const handleAddToCart = async () => {
    const user_id = localStorage.getItem("user_id");
    const nama = localStorage.getItem("nama");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    console.log("User login data from localStorage:", {
      user_id,
      nama,
      email,
      token,
    });

    // Validasi apakah pengguna sudah login
    if (!nama || !email || !token) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Silakan login terlebih dahulu untuk menambahkan ke keranjang.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Validasi apakah menuDetail tersedia
    if (!menuDetail || !menuDetail.id) {
      console.error("Menu detail is not available:", menuDetail);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Data produk tidak tersedia.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      // Data transaksi yang akan dikirim ke backend
      const transactionData = {
        user_id: user_id, // Diambil dari localStorage
        product_id: menuDetail.id, // Gunakan menuDetail.id
        jumlah: quantity, // Jumlah produk yang ditambahkan
      };

      console.log("Transaction data:", transactionData);

      // Kirim data ke backend
      const response = await axios.post(
        "http://localhost:8000/transaksi/",
        transactionData
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Produk berhasil ditambahkan ke keranjang.",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );

      // Tampilkan pesan error berdasarkan respons dari backend
      Swal.fire({
        icon: "error",
        title: "Maaf",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan ke keranjang.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <div className="relative bg-zinc-100 ml-[62px]">
      <div className="-left-4 top-0 absolute">
        <div className="w-[191px] h-[27px] left-[480px] top-[48px] absolute text-center text-amber-600 text-[40px] font-bold font-['Nunito'] capitalize">
          our menu
        </div>
        <div className="w-[1063px] h-[354px] left-[60px] top-[128px] absolute bg-white rounded-[5px] shadow border border-black/20">
          <div className="left-[28px] top-[290px] absolute text-blue-950 text-[25px] font-bold font-['Nunito'] capitalize">
            {menuDetail ? menuDetail.nama : "Loading..."}
          </div>
          <button
            className="w-[151.95px] h-[39px] left-[737px] top-[275px] absolute bg-blue-950 rounded-[5px] flex items-center justify-center hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 z-10"
            onClick={handleAddToCart}
          >
            <span className="text-white text-[17px] font-normal font-['Nunito'] capitalize">
              Add to Cart
            </span>
          </button>
          <div className="w-[1061px] h-[250px] left-[1px] top-[1px] absolute">
            <img
              className="w-[358px] h-[253px] left-[27px] top-[32px] absolute rounded-[5px]"
              src={
                menuDetail && menuDetail.gambar
                  ? `http://localhost:8000/uploads/${menuDetail.gambar}`
                  : "https://via.placeholder.com/358x253"
              }
              alt="Menu item"
            />

            <div className="w-[133px] h-[34px] left-[736px] top-[32px] absolute text-amber-600 text-[25px] font-normal font-['Nunito'] capitalize">
              {menuDetail ? `Rp${menuDetail.harga}` : "Loading..."}
            </div>
          </div>
          <div className="w-[1061px] h-[250px] left-[1px] top-[1px] absolute">
            <div className="w-[104.98px] h-[17px] left-[736px] top-[90px] absolute flex">
              {averageRating === null || averageRating === 0
                ? renderStars(0) // If no rating or 0, show 5 gray stars
                : renderStars(averageRating)}
            </div>
            <div className="w-[60px] h-[27px] left-[552px] top-[37px] absolute text-amber-600 text-xl font-bold font-['Nunito'] capitalize">
              Price
            </div>
            <div className="w-[177.81px] h-[27px] left-[552px] top-[133px] absolute text-amber-600 text-xl font-bold font-['Nunito'] capitalize">
              Description
            </div>
            <div className="w-[177.81px] h-[27px] left-[552px] top-[85px] absolute text-amber-600 text-xl font-bold font-['Nunito'] capitalize">
              Rating
            </div>
            <div className="w-[325px] h-12 left-[736px] top-[142px] absolute text-stone-500 text-base font-normal font-['Nunito'] capitalize leading-normal">
              {menuDetail ? menuDetail.deskripsi : "Loading..."}
            </div>
          </div>
        </div>
        <div className="w-[1071px] min-h-[442px] left-[60px] top-[502px] absolute bg-white rounded-[5px] shadow border border-black/20">
          <div className="w-[177.81px] h-[27px] left-[20px] top-[15px] absolute text-center text-amber-600 text-xl font-bold font-['Nunito'] capitalize">
            customer&apos;s review
          </div>

          <div className="w-[903px] h-[403px] left-[27px] top-[-163px] absolute">
            <div className="w-[193px] h-10 left-[710px] mt-2 top-0 absolute flex items-center justify-start">
              {/* Minus Button */}
              <button
                className="w-8 h-8 bg-blue-950 rounded-full border-2 border-blue-950 flex items-center justify-center"
                onClick={() => updateQuantity(-1)}
              >
                <img src={TombolButton} alt="Minus" className="w-8 h-8" />
              </button>

              {/* Quantity Display */}
              <div
                id="quantity"
                className="text-amber-600 text-[25px] font-normal font-['Nunito'] ml-4"
              >
                {quantity}
              </div>

              {/* Plus Button */}
              <button
                className="w-8 h-8 bg-blue-950 rounded-full border-2 border-blue-950 flex items-center justify-center ml-4"
                onClick={() => updateQuantity(1)}
              >
                <img src={TombolButton2} alt="Plus" className="w-8 h-8" />
              </button>
            </div>
          </div>

          <div className="w-full space-y-6 mt-12">
            {/* Jika ada review, tampilkan setiap review */}
            {reviews && reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b-[1px] border-stone-500 pb-4 mb-4"
                >
                  <div className="flex items-start space-x-4">
                    {/* Gambar Profil */}
                    <div className="ml-4 w-[70px] h-[70px] rounded-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={gbrAkun}
                        alt={`User Avatar ${index}`}
                      />
                    </div>

                    {/* Informasi Review */}
                    <div className="flex-1">
                      <div className="flex justify-start items-cente">
                        {/* Nama Pengguna */}
                        <div
                          key={review.id}
                          className="text-blue-950 text-xl font-bold font-['Nunito'] capitalize"
                        >
                          {review.userName}
                        </div>

                        {/* Rating */}
                        <div className="flex space-x-1 mt-1 ml-6">
                          {" "}
                          {/* Margin kiri lebih kecil */}
                          {[...Array(Math.floor(review.rating))].map(
                            (_, starIndex) => (
                              <i
                                key={`star-${starIndex}`}
                                className="fas fa-star text-amber-600 text-[17px] font-black"
                              ></i>
                            )
                          )}
                        </div>
                      </div>

                      {/* Komentar */}
                      <div className="text-stone-500 text-[15px] font-normal font-['Nunito'] capitalize leading-[27px] mt-2">
                        {review.comment}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No reviews yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailMenu;
