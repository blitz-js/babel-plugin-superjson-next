import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps2 } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
function Page({ products }) {
  return JSON.stringify(products);
}
import { getStaticProps, getServerSideProps } from './props';
export const getServerSideProps = _withSuperJSONProps2(getServerSideProps);
export const getStaticProps = _withSuperJSONProps(getStaticProps);

export default _withSuperJSONPage(Page);
