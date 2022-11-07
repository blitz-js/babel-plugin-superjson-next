import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
import {
  getServerSideProps,
  PreviewPage,
} from '../../../common-components/contentful-elements/pages/preview';

export { getServerSideProps };

export default _withSuperJSONPage(PreviewPage);
