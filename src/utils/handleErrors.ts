import { useHistory } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const handleDefault = (error: any) => {
  alert(`Unhandled error ${JSON.stringify(error)}`);
};

const handle401 = (message: any) => {
  alert(message);
};

const handle403 = () => {
  const navigate = useHistory();
  navigate.push('/role');
};

const handle500 = (message: any) => {
  const trans = useTranslation();
  alert(`${trans('Error on our side')} - ${message}`);
};

const handleErrors = (error: any) => {
  switch (error.response.status) {
    case 401:
      handle401(error.response.data.message);
      break;
    case 403:
      handle403();
      break;
    case 500:
      handle500(error.response.data.message);
      break;
    default:
      handleDefault(error);
  }
};

export default handleErrors;
