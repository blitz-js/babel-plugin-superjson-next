import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONGSSP as _withSuperJSONGSSP } from 'babel-plugin-superjson-next/tools';
export const getStaticProps = _withSuperJSONGSSP(async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];
  return {
    props: {
      products,
    },
  };
});

function Page({ products }) {
  return JSON.stringify(products);
}

export default _withSuperJSONPage(Page);
