import { useNavigate } from 'react-router-dom';

const handle403 = () => {
  const navigate = useNavigate();
  navigate('/role');
};

const handle500 = (message: string) => {
  alert(message);
};

const handleErrors = (error) => {
  if (error.status === '403') {
    handle403();
  } else if (error.status === '500') {
    handle500(error.message);
  }
};
export default handleErrors;
