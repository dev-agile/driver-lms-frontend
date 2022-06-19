import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddContactModal from "../components/AddContactModal";
import Autocomplete, { geocodeByPlaceId } from "react-google-autocomplete";

import { logout } from "../helper-methods";

const Dashboard = (props) => {
  const userData = useSelector((state) => state?.userData);

  const [showAddContact,_showAddContact] = useState(false);

  useEffect(() => {
    if (!userData?.token && !userData?.user) {
      props.history.push("/login");
    }
  }, [userData]);

  const _logout = (_) => {
    logout();
  };
  
  return (
    <>
    <div style={{display: 'flex',
    justifyContent: 'space-between'}}>
      <h1>Dashboard</h1>
      <button  onClick={() => _showAddContact(prev =>prev =  !prev)}>Add Contact</button>

    </div>
      <button onClick={_logout}>Logout</button>

      {
         showAddContact && (
            <AddContactModal isVisible={showAddContact} closeModal={() => _showAddContact(prev =>prev =  !prev)} />
          )
        }
    </>
  );
};

export default Dashboard;
