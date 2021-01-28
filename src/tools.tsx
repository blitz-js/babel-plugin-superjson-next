import SuperJSON from 'superjson';
import * as hoistNonReactStatics from 'hoist-non-react-statics';
import type { GetServerSideProps } from 'next';
import * as React from 'react';

type SuperJSONProps = ReturnType<typeof SuperJSON.serialize> & {
  _superjson: true;
};

export function withSuperJSONProps<P>(
  gssp: GetServerSideProps<P>
): GetServerSideProps<SuperJSONProps> {
  return async function withSuperJSON(...args) {
    const result = await gssp(...args);

    if (!('props' in result)) {
      return result;
    }

    const { json, meta } = SuperJSON.serialize(result.props);

    const props: SuperJSONProps = {
      json,
      _superjson: true,
    };

    if (Boolean(meta)) {
      props.meta = meta;
    }

    return {
      ...result,
      props,
    };
  };
}

export function withSuperJSONPage<P>(
  Page: React.ComponentType<P>
): React.ComponentType<SuperJSONProps> {
  function WithSuperJSON(serializedProps: SuperJSONProps) {
    if (!serializedProps._superjson) {
      const PageWithoutProps = Page as React.ComponentType<{}>;
      return <PageWithoutProps {...serializedProps as any as P} />;
    }

    const props = SuperJSON.deserialize<P>(serializedProps);
    return <Page {...props} />;
  }

  hoistNonReactStatics(WithSuperJSON, Page);

  return WithSuperJSON;
}
