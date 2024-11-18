import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  image: string | null;
  isFollowed: boolean;
}

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get<User>(
          `http://localhost:3000/users/${userId}`,
        );
        setUser(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Details</h1>
      {user ? (
        <div>
          <img
            src={user.image || 'https://via.placeholder.com/150'}
            alt={`${user.name}'s avatar`}
            style={{ borderRadius: '50%', width: '150px', height: '150px' }}
          />
          <h2>{user.name}</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
          <p>
            <strong>Followed:</strong> {user.isFollowed ? 'Yes' : 'No'}
          </p>
        </div>
      ) : (
        <p>No user found.</p>
      )}
    </div>
  );
};

export default UserDetails;
