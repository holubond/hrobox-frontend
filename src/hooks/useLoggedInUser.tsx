import React, {
  createContext, Dispatch, FC, SetStateAction, useContext, useState
} from 'react';

type Role = 'Admin'|'Verified user'|'Unverified user'|'Banned user'|undefined;
type User = {
  jwt: string,
  role: Role
}
type UserState = [User, Dispatch<SetStateAction<User>>];

const UserContext = createContext<UserState>(undefined as never);

export const UserProvider: FC = ({ children }) => {
  const userState = useState<User>(
    // eslint-disable-next-line space-in-parens
    (localStorage.getItem('jwt') === null )
      ? { jwt: '', role: undefined }
      : { jwt: localStorage.getItem('jwt') as string, role: localStorage.getItem('role') as Role }
  );
  return (
    <UserContext.Provider value={userState}>
      {children}
    </UserContext.Provider>
  );
};

const useLoggedInUser = () => useContext(UserContext);
export default useLoggedInUser;
