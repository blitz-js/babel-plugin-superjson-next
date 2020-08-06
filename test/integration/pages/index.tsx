import { InferGetServerSidePropsType } from 'next';

export const getServerSideProps = async () => {
  return {
    props: {
      date: new Date(0),
    },
  };
};

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return 'props.date is Date: ' + (props.date instanceof Date);
}
