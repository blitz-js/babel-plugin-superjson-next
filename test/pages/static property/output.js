import { withSuperJSONPage as _withSuperJSONPage } from 'babel-plugin-superjson-next/tools';
import { withSuperJSONProps as _withSuperJSONProps } from 'babel-plugin-superjson-next/tools';
import Text from '../components/Text';
export const getServerSideProps = _withSuperJSONProps(() => {
  return {
    props: {
      text: 'hi',
    },
  };
}, ['smth']);

function Page() {
  return 'foo';
}

Page.getLayout = function getLayout(page) {
  return 'bar';
};

export default _withSuperJSONPage(Page);
