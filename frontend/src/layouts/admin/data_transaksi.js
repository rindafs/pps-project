import React from "react";
import NavbarAdmin from "../../components/admin/navbarAdmin";
import GetTransaksi from "../../components/admin/data_transaksi";

function DataTransaksi(){
    return(
        <div>
            <NavbarAdmin />
            <GetTransaksi />
        </div>
    );
};

export default DataTransaksi;