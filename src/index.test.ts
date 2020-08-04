import superJsonWithNext from './';
import pluginTester from 'babel-plugin-tester';

const dontUsePrettier = (c: string) => c

pluginTester({
  plugin: superJsonWithNext,

  tests: {
    'changes this code': {
      // input to the plugin
      code: `
export const getServerSideProps = async () => {
  const products = [{ name: 'Hat', publishedAt: new Date(0) }];

  return { props: { products } };
};

export default function Page({ products }) {
  return JSON.stringify(products)
}
      `,
      // expected output
      output: `
import SuperJSON from "superjson";

export const getServerSideProps = async () => {
  const products = [{ name: 'Hat', publishedAt: new Date(0) }];

  return { props: { SuperJSON: SuperJSON.serialize({ products }) } };
};

export default function Page(props) {
  let { products } = SuperJSON.deserialize(props.SuperJSON);
  return JSON.stringify(products)
}
      `,
    },
  },

  formatResult: dontUsePrettier,
});
