import { useHistory } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const handle403 = () => {
  const navigate = useHistory();
  navigate.push('/role');
};

const handle500 = (response: any) => {
  const trans = useTranslation();
  alert(trans('Error on our side') + response);
};

const handle400 = () => {
  alert('Client-side error (400, bad request)');
};

const handleErrors = (error: any) => {
  switch (error.response.status) {
    case 403:
      handle403();
      break;
    case 500:
      handle500(error.response);
      break;
    default:
      handle400();
  }
};
};
export default handleErrors;
