import React from 'react';

const ProfilePage = (
  {params} : { params: {id: string} }
) => {

  return (
    <div>
      Prof profile with id: {params.id} , should be displayed here
    </div>
  );
};

export default ProfilePage;