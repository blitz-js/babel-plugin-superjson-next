import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONGSSP as _withSuperJSONGSSP } from 'babel-plugin-superjson-next/tools';
export const getServerSideProps = _withSuperJSONGSSP(async () => {
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

class Page {
  render({ products }) {
    return JSON.stringify(products);
  }
}

export default _withSuperJSONPage(Page);
