import React, {
  createContext, Dispatch, FC, SetStateAction, useContext, useState
} from 'react';

type User = {
  jwt: string,
  role: string
}
type UserState = [User, Dispatch<SetStateAction<User>>];

const UserContext = createContext<UserState>(undefined as never);

export const UserProvider: FC = ({ children }) => {
  const userState = useState<User>({ jwt: '', role: '' });
  return (
    <UserContext.Provider value={userState}>
      {children}
    </UserContext.Provider>
  );
};

const useLoggedInUser = () => useContext(UserContext);
export default useLoggedInUser;
