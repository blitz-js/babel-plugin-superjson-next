import type { GetStaticProps, InferGetStaticPropsType } from 'next';

export async function getStaticProps() {
  return {
    props: {
      date: new Date(0),
    },
  };
};

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return 'props.date is Date: ' + (props.date instanceof Date);
}
