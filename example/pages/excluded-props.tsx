import type { InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  return {
    props: {
      superJsonSkipped: new Date(0).toISOString(),
      date: new Date(0)
    },
  };
}

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    'props.superJsonSkipped is string: ' +
    (typeof props.superJsonSkipped === 'string')
  );
};

export default Page;
