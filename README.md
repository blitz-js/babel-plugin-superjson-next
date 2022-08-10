<p style="display: flex; justify-content: center; align-items: center;">
  <img alt="superjson" src="https://github.com/blitz-js/superjson/raw/main/docs/superjson.png" width="180" />
  <span style="margin: 12px; font-size: 24px; font-weight: 100">X</span>
  <img alt="next.js" src="https://seeklogo.com/images/N/next-js-logo-7929BCD36F-seeklogo.com.png" width="90" />
</p>

<p align="center">
  Automatically transform your Next.js Pages to use <a href="https://github.com/blitz-js/superjson">SuperJSON</a>.
  Supports <code>getStaticProps</code> & <code>getServerSideProps</code>.
</p>

<p align="center">
  <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors"><img src="https://img.shields.io/badge/all_contributors-21-orange.svg?style=flat-square" alt="All Contributors"/></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
  <a href="https://www.npmjs.com/package/babel-plugin-superjson-next">
    <img alt="npm" src="https://img.shields.io/npm/v/babel-plugin-superjson-next" />
  </a>

  <a href="https://github.com/blitz-js/babel-plugin-superjson-next/actions">
    <img
      alt="CI"
      src="https://github.com/blitz-js/babel-plugin-superjson-next/workflows/CI/badge.svg"
    />
  </a>
</p>

## Getting started

Install the library with your package manager of choice, e.g.:

```
npm install babel-plugin-superjson-next
```

Since this is a companion to [SuperJSON](https://github.com/blitz-js/superjson), 
make sure it's also installed:

```
npm install superjson
```

> for npm 7 or later, you can skip this since from npm v7 automatically installs peer dependencies

Add the plugin to your `.babelrc`.
If you don't have one, create it.

```json5
{
  presets: ['next/babel'],
  plugins: [
    ...
    'superjson-next' // 👈
  ]
}
```

That's it! Now you're free to use all values and type supported by SuperJSON in your Next.js Components.

<!-- Potential new section: how it works -->

### Options

You can use the `exclude` option to exclude specific properties from serialisation.

```json5
{
  presets: ['next/babel'],
  plugins: [
    ...
    ['superjson-next', { exclude: ["someProp"] }]
  ]
}
```

## Contributing

1. Clone the repo
1. `yarn`
1. `yarn build`

### Test Example App

1. `cd example`
2. `yarn` (make sure you first run `yarn build` in the repo root)
3. `yarn test`

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Skn0tt"><img src="https://avatars1.githubusercontent.com/u/14912729?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Simon Knott</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=Skn0tt" title="Code">💻</a> <a href="#video-Skn0tt" title="Videos">📹</a> <a href="#ideas-Skn0tt" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-Skn0tt" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://twitter.com/flybayer"><img src="https://avatars3.githubusercontent.com/u/8813276?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brandon Bayer</b></sub></a><br /><a href="#ideas-flybayer" title="Ideas, Planning, & Feedback">🤔</a> <a href="#talk-flybayer" title="Talks">📢</a></td>
    <td align="center"><a href="https://github.com/ntgussoni"><img src="https://avatars0.githubusercontent.com/u/10161067?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Torres</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=ntgussoni" title="Code">💻</a> <a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=ntgussoni" title="Tests">⚠️</a> <a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Antgussoni" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.benjaminjohnson.me"><img src="https://avatars1.githubusercontent.com/u/20060118?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Benjamin Johnson</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=Benjamminj" title="Code">💻</a> <a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=Benjamminj" title="Tests">⚠️</a> <a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3ABenjamminj" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/jorisre"><img src="https://avatars1.githubusercontent.com/u/7545547?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joris</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=jorisre" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/alexrohleder"><img src="https://avatars2.githubusercontent.com/u/7248028?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Rohleder</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Aalexrohleder" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://kattcorp.com"><img src="https://avatars1.githubusercontent.com/u/459267?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Johansson</b></sub></a><br /><a href="#question-KATT" title="Answering Questions">💬</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://cyr.us/"><img src="https://avatars3.githubusercontent.com/u/19656?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cyrus</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Acyrus" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://gabeoleary.com"><img src="https://avatars1.githubusercontent.com/u/16123225?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gabe O'Leary</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Agoleary" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/jlmodell"><img src="https://avatars1.githubusercontent.com/u/48035911?v=4?s=100" width="100px;" alt=""/><br /><sub><b>jlmodell</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Ajlmodell" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://cheese.graphics"><img src="https://avatars2.githubusercontent.com/u/45247477?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cheese</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3AChGGse" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://juanm04.com"><img src="https://avatars1.githubusercontent.com/u/16712703?v=4?s=100" width="100px;" alt=""/><br /><sub><b>JuanM04</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3AJuanM04" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://pieter.venter.pro/"><img src="https://avatars.githubusercontent.com/u/1845861?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pieter Venter</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Acyrus-za" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://iffa.dev"><img src="https://avatars.githubusercontent.com/u/759522?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Santeri Elo</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=iffa" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://dalbitresb.com"><img src="https://avatars.githubusercontent.com/u/7624090?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Diego Albitres</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=dalbitresb12" title="Code">💻</a></td>
    <td align="center"><a href="https://typeofweb.com"><img src="https://avatars.githubusercontent.com/u/1338731?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michał Miszczyszyn</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Ammiszy" title="Bug reports">🐛</a> <a href="#plugin-mmiszy" title="Plugin/utility libraries">🔌</a></td>
    <td align="center"><a href="https://italodeandra.de"><img src="https://avatars.githubusercontent.com/u/19225266?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ítalo Andrade</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Aitalodeandra" title="Bug reports">🐛</a> <a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=italodeandra" title="Code">💻</a></td>
    <td align="center"><a href="https://vincas.dev"><img src="https://avatars.githubusercontent.com/u/944727?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vincas Stonys</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Avincaslt" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/felipeptcho"><img src="https://avatars.githubusercontent.com/u/656062?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Felipe Lima</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=felipeptcho" title="Code">💻</a> <a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3Afelipeptcho" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://velog.io/@jay"><img src="https://avatars.githubusercontent.com/u/6510430?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dante</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=dante01yoon" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Haberkamp"><img src="https://avatars.githubusercontent.com/u/35109813?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nils Haberkamp</b></sub></a><br /><a href="https://github.com/blitz-js/babel-plugin-superjson-next/commits?author=Haberkamp" title="Code">💻</a> <a href="#plugin-Haberkamp" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/blitz-js/babel-plugin-superjson-next/issues?q=author%3AHaberkamp" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
