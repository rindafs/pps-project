import React from "react";
import NavbarAdmin from "../../components/admin/navbarAdmin";
import GetUser from "../../components/admin/data_user";

function DataUser(){
    return(
        <div>
            <NavbarAdmin />
            <GetUser />
        </div>
    );
};

export default DataUser;