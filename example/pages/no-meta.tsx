import { InferGetServerSidePropsType } from 'next';

export const getStaticProps = async () => {
  return {
    props: {
      rawField: 'test'
    },
  };
};

export default function NoMetaProps(
  props: InferGetServerSidePropsType<typeof getStaticProps>
) {
  return 'props.rawField is String: ' + props.rawField;
}
