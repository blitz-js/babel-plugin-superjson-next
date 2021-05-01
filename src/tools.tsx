import SuperJSON from 'superjson';
import * as hoistNonReactStatics from 'hoist-non-react-statics';
import type { GetServerSideProps } from 'next';
import * as React from 'react';

type SuperJSONProps<P> = P & {
  _superjson?: ReturnType<typeof SuperJSON.serialize>['meta'];
};

export function withSuperJSONProps<P>(
  gssp: GetServerSideProps<P>,
  exclude: string[] = []
): GetServerSideProps<SuperJSONProps<P>> {
  return async function withSuperJSON(...args) {
    const result = await gssp(...args);

    if (!('props' in result)) {
      return result;
    }

    if (!result.props) {
      return result;
    }

    const { json, meta } = SuperJSON.serialize(result.props);
    const props = json as any;

    if (meta) {
      props._superjson = meta;
    }

    return {
      ...result,
      props,
    };
  };
}

export function withSuperJSONPage<P>(
  Page: React.ComponentType<P>
): React.ComponentType<SuperJSONProps<P>> {
  function WithSuperJSON(serializedProps: SuperJSONProps<P>) {
    const { _superjson, ...props } = serializedProps;
    return (
      <Page
        {...SuperJSON.deserialize({ json: props as any, meta: _superjson })}
      />
    );
  }

  hoistNonReactStatics(WithSuperJSON, Page);

  return WithSuperJSON;
}
