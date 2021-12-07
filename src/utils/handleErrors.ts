import { useHistory } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const trans = useTranslation();

const handle403 = () => {
  const navigate = useHistory();
  navigate.push('/role');
};

const handle500 = () => {
  alert(trans('Error on our side'));
};

const handleErrors = (error: any) => {
  switch (error.response.status) {
    case 403:
      handle403();
      break;
    case 500:
      handle500();
      break;
    default:
  }
};
export default handleErrors;
