import SuperJSON from 'superjson';
import * as hoistNonReactStatics from 'hoist-non-react-statics';
import type { GetServerSideProps } from 'next';
import * as React from 'react';

type SuperJSONResult = any;

export function withSuperJSONProps<P>(
  gssp: GetServerSideProps<P>
): GetServerSideProps<SuperJSONResult> {
  return async function withSuperJSON(...args) {
    const result = await gssp(...args);
    const { json, meta } = SuperJSON.serialize(result.props as any)

    const props: SuperJSONResult = { json }

    if (Boolean(meta)) {
      props.meta = meta
    }

    return {
      ...result,
      props
    };
  };
}

export function withSuperJSONPage<P>(
  Page: React.ComponentType<P>
): React.ComponentType<SuperJSONResult> {
  const WithSuperJSON = (serializedProps: any) => {
    const props = (SuperJSON.deserialize(serializedProps) as unknown) as P;
    return <Page {...props} />;
  };

  hoistNonReactStatics(WithSuperJSON, Page);

  return WithSuperJSON;
}
