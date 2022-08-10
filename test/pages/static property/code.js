import Text from '../components/Text';

export const getServerSideProps = () => {
  return {
    props: {
      text: 'hi',
    },
  };
};

export default function Page() {
  return 'foo';
}

Page.getLayout = function getLayout(page) {
  return 'bar';
};
