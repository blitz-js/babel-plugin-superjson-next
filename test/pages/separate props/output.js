import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps2 } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
import { getStaticProps, getServerSideProps } from './props';

function Page({ products }) {
  return JSON.stringify(products);
}

export default _withSuperJSONPage(Page);
export const getServerSideProps = _withSuperJSONProps2(getServerSideProps);
export const getStaticProps = _withSuperJSONProps(getStaticProps);
