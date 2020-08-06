import superJsonWithNext from './plugin';
import pluginTester from 'babel-plugin-tester';

pluginTester({
  plugin: superJsonWithNext,

  tests: {
    'transforms a valid example': {
      // input to the plugin
      code: `
export const getServerSideProps = async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0)
    }
  ];

  return {
    props: {
      products,
    },
  };
};

export default function Page({ products }) {
  return JSON.stringify(products)
}
      `,
      output: `
import { withSuperJSONPage as _withSuperJSONPage } from 'superjson-with-next';
import { withSuperJSONGSSP as _withSuperJSONGSSP } from 'superjson-with-next';
export const getServerSideProps = _withSuperJSONGSSP(async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];
  return {
    props: {
      products,
    },
  };
});

function Page({ products }) {
  return JSON.stringify(products);
}

export default _withSuperJSONPage(Page);`,
    },

    'transforms a valid example with export declaration': {
      // input to the plugin
      code: `
export const getServerSideProps = async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0)
    }
  ];

  return {
    props: {
      products,
    },
  };
};

function Page({ products }) {
  return JSON.stringify(products)
}

export default Page;
      `,
      output: `
import { withSuperJSONPage as _withSuperJSONPage } from 'superjson-with-next';
import { withSuperJSONGSSP as _withSuperJSONGSSP } from 'superjson-with-next';
export const getServerSideProps = _withSuperJSONGSSP(async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];
  return {
    props: {
      products,
    },
  };
});

function Page({ products }) {
  return JSON.stringify(products);
}

export default _withSuperJSONPage(Page);`,
    },

    'transforms a valid example using gSSP function expression': {
      // input to the plugin
      code: `
export async function getServerSideProps() {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0)
    }
  ];
  return {
    props: {
      products,
    },
  };
};

export default function Page({ products }) {
  return JSON.stringify(products)
}`,
      output: `
import { withSuperJSONPage as _withSuperJSONPage } from 'superjson-with-next';
import { withSuperJSONGSSP as _withSuperJSONGSSP } from 'superjson-with-next';
export const getServerSideProps = _withSuperJSONGSSP(
  async function getServerSideProps() {
    const products = [
      {
        name: 'Hat',
        publishedAt: new Date(0),
      },
    ];
    return {
      props: {
        products,
      },
    };
  }
);
function Page({ products }) {
  return JSON.stringify(products);
}

export default _withSuperJSONPage(Page);`,
    },

    'transforms a valid example using class components': {
      // input to the plugin
      code: `
export const getServerSideProps = async () => {
  const products = [
    {
      name: "Hat",
      publishedAt: new Date(0),
    },
  ];

  return {
    props: { products },
  };
};

export default class Page {
  render({ products }) {
    return JSON.stringify(products);
  }
}`,
      output: `
import { withSuperJSONPage as _withSuperJSONPage } from 'superjson-with-next';
import { withSuperJSONGSSP as _withSuperJSONGSSP } from 'superjson-with-next';
export const getServerSideProps = _withSuperJSONGSSP(async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];
  return {
    props: {
      products,
    },
  };
});

class Page {
  render({ products }) {
    return JSON.stringify(products);
  }
}

export default _withSuperJSONPage(Page);`,
    },

    "does not change a page that doesn't export gSSP": `
const getServerSideProps = async () => {
  const products = [
    {
      name: 'Hat',
      publishedAt: new Date(0),
    },
  ];
  return {
    props: {
      products,
    },
  };
};

export default function Page({ products }) {
  return JSON.stringify(products);
}
    `,
  },
});
