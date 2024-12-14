import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({}); // Menyimpan rating produk berdasarkan ID
  const navigate = useNavigate();

  // Ambil data produk
  useEffect(() => {
    axios
      .get("http://localhost:8000/products")
      .then((response) => {
        setProducts(response.data);
        // Ambil rating untuk setiap produk berdasarkan ID
        response.data.forEach((product) => {
          axios
            .get(`http://localhost:8000/review/average-rating/${product.id}`) // Gantilah URL di sini
            .then((ratingResponse) => {
              // Ambil averageRating dan ubah menjadi angka desimal
              const averageRating = parseFloat(
                ratingResponse.data.averageRating
              );
              setRatings((prevRatings) => ({
                ...prevRatings,
                [product.id]: averageRating, // Simpan rating produk berdasarkan ID
              }));
            })
            .catch((error) => {
              console.error("Error fetching rating:", error);
            });
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  if (products.length === 0) return <div>Loading...</div>;

  return (
    <div className="w-[1512px] h-[2500px] relative bg-[#eeeeee]">
      <div className="w-[1200px] h-[1524px] left-[56px] top-0 absolute">
        <div className="w-[191px] h-[27px] left-[550px] top-[48px] absolute text-center text-[#e28606] text-[40px] font-bold font-['Nunito'] capitalize">
          our menu
        </div>
        <div className="product-grid flex flex-wrap gap-8 justify-start p-4 mt-28 pl-18">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[350px] h-[442px] bg-white rounded-[5px] shadow border border-black/20 relative"
            >
              {/* Rating */}
              <div className="absolute top-[251px] left-[21px] flex space-x-1">
                {[...Array(5)].map((_, index) => {
                  const rating = ratings[product.id];
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
              <div className="left-[21px] top-[280px] absolute text-[#192a56] text-[25px] font-bold font-['Nunito'] capitalize">
                {product.nama}
              </div>

              {/* Deskripsi Produk */}
              <div className="w-[298.67px] h-12 left-[21px] top-[319px] absolute text-[#666666] text-base font-normal font-['Nunito'] capitalize leading-normal">
                {product.deskripsi}
              </div>

              {/* Button Detail */}
              <button
                onClick={() => navigate(`/products/${product.id}`)}
                className="w-[151.95px] h-[39px] left-[21px] top-[382px] absolute bg-[#192a56] rounded-[5px] flex items-center justify-center hover:bg-[#1e3a70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3a70]"
              >
                <span className="text-white text-[17px] font-normal font-['Nunito'] capitalize">
                  Detail Menu
                </span>
              </button>

              {/* Harga */}
              <div className="w-[133px] h-[34px] left-[186px] top-[382px] absolute text-[#e28606] text-[25px] font-normal font-['Nunito'] capitalize">
                Rp{product.harga}
              </div>

              {/* Gambar Produk */}
              <img
                className="w-[318px] h-[220px] left-[15px] top-[15px] absolute rounded-[5px]"
                src={`http://localhost:8000/uploads/${product.gambar}`}
                alt={product.nama}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;
