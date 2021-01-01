import SuperJSON from 'superjson';
import * as hoistNonReactStatics from 'hoist-non-react-statics';
import type { GetServerSideProps } from 'next';
import * as React from 'react';

type SuperJSONResult = ReturnType<typeof SuperJSON.serialize>;

export function withSuperJSONProps<P>(
  gssp: GetServerSideProps<P>
): GetServerSideProps<SuperJSONResult> {
  return async function withSuperJSON(...args) {
    const result = await gssp(...args);

    if (!('props' in result)) {
      return result;
    }

    const { json, meta } = SuperJSON.serialize(result.props);

    const props: SuperJSONResult = { json };

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
): React.ComponentType<SuperJSONResult> {
  function WithSuperJSON(serializedProps: SuperJSONResult) {
    if (!serializedProps.json) {
      const PageWithoutProps = Page as React.ComponentType<{}>;
      return <PageWithoutProps />;
    }

    const props = SuperJSON.deserialize<P>(serializedProps);
    return <Page {...props} />;
  }

  hoistNonReactStatics(WithSuperJSON, Page);

  return WithSuperJSON;
}
