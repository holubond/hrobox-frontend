import { useHistory } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const handle403 = () => {
  const navigate = useHistory();
  navigate.push('/role');
};

const handle400 = () => {
  alert('Client-side error (400, bad request)');
};

const handle500 = () => {
  const trans = useTranslation();

  alert(trans('Error on our side'));
};

const handleErrors = (error: any) => {
  switch (error.response.status) {
    case 403:
      handle403();
      break;
    case 400:
      handle400();
      break;
    case 500:
      handle500();
      break;
    default:
  }
};
export default handleErrors;
