import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
import { getStaticProps as _getStaticProps } from './props';
function Page({ products }) {
  return JSON.stringify(products);
}
export const getStaticProps = _withSuperJSONProps(getStaticProps);
export default _withSuperJSONPage(Page);
