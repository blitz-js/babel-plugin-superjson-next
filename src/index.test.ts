import superJsonWithNext from './';
import pluginTester from 'babel-plugin-tester';

pluginTester({
  plugin: superJsonWithNext,

  tests: {
    'transforms a valid example': {
      // input to the plugin
      code: `
export const getServerSideProps = async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0)
    }
  ];

  return { props: { products } };
};

export default function Page({ products }) {
  return JSON.stringify(products)
}
      `,
      output: `
import SuperJSON from "superjson";

export const getServerSideProps = async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];

  return ((r) => (r.props ? ((r.props = SuperJSON.serialize(r.props)), r) : r))(
    {
      props: {
        products,
      },
    }
  );
};

export default function Page(props) {
  let { products } = SuperJSON.deserialize(props.SuperJSON);
  return JSON.stringify(products);
}
      `,
    },

    "does not change a page that doesn't export gSSP": `
const getServerSideProps = async () => {
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
};

export default function Page({ products }) {
  return JSON.stringify(products);
}
    `,
  },
});
