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
import { withSuperJSONGSSP, withSuperJSONPage } from 'superjson-with-next';
export const getServerSideProps = withSuperJSONGSSP(async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];

  return { props: { products } };
});
export default withSuperJSONPage(function Page({ products }) {
  return JSON.stringify(products);
})`,
    },

    'transforms a valid example using gSSP function expression': {
      // input to the plugin
      code: `
export async function getServerSideProps() {
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
import { withSuperJSONGSSP, withSuperJSONPage } from 'superjson-with-next';
export const getServerSideProps = withSuperJSONGSSP(async function getServerSideProps() {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];

  return { props: { products } };
});
export default withSuperJSONPage(function Page({ products }) {
  return JSON.stringify(products);
})`,
    },

    'transforms a valid example using class components': {
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

export default class Page {
  render({ products }) {
    return JSON.stringify(products)
  }
}
      `,
      output: `
import { withSuperJSONGSSP, withSuperJSONPage } from 'superjson-with-next';
export const getServerSideProps = withSuperJSONGSSP(async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];

  return { props: { products } };
});
export default withSuperJSONPage(class Page {
  render({ products }) {
    return JSON.stringify(products);
  }
})`,
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
