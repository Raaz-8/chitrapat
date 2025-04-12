import React, { useEffect, useState } from 'react';
import { checkIfAdmin } from '../../utils/isAdmin';
import { useNavigate } from 'react-router-dom';
import Loader from "../GlobalComponents/Loader";

const AdminWrapper = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (!localUser || !localUser.email) {
        navigate('/login');
      } else {
        checkIfAdmin(localUser.email).then((isAdminUser) => {
          if (isAdminUser) {
            setIsAdmin(true);
          } else {
            navigate('/not-authorized');
          }
        });
      }
    }, []);


  if (isAdmin === null) return <Loader />;
  return <>{children}</>;
};

export default AdminWrapper;
