import { useTranslation } from '../hooks/useTranslation';

const handle500 = () => {
  const trans = useTranslation();
  alert(trans('Error on our side'));
};

const handle400 = () => {
  alert('Client-side error (400, bad request)');
};

const handleErrors = (error: any) => {
  switch (error.response.status) {
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
