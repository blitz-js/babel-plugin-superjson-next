import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
export const getStaticProps = _withSuperJSONProps(() => ({
  props: {
    today: new Date(),
  },
}));

function IndexPage({ today }) {
  return JSON.stringify({
    today,
  });
}

export default _withSuperJSONPage(IndexPage);
