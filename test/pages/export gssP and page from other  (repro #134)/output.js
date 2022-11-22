import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
import {
  getServerSideProps as _getServerSideProps,
  PreviewPage,
} from '../../../common-components/contentful-elements/pages/preview';
export const getServerSideProps = _withSuperJSONProps(_getServerSideProps, [
  'smth',
]);
export default _withSuperJSONPage(PreviewPage);
