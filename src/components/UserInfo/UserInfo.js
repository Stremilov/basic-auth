import React, { useEffect, useState } from 'react';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8000/users/me", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <h1>User Information</h1>
      {userInfo ? (
        <div>
          <p>Email: {userInfo.email}</p>
          <p>Name: {userInfo.name}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default UserInfo;
