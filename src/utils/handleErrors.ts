import { useHistory } from 'react-router-dom';

const handle403 = () => {
  const navigate = useHistory();
  navigate.push('/role');
};

const handle500 = (message: string) => {
  alert(message);
};

const handle404 = (message: string) => {
  alert(message);
};

const handleErrors = (error: any) => {
  switch (error.response.status) {
    case 403:
      handle403();
      break;
    case 404:
      handle404(error.response.data.message);
      break;
    case 500:
      handle500(error.response.data.message);
      break;
    default:
  }
};
export default handleErrors;
