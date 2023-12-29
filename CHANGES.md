# Changes

## 12.0.0

- [`1144e38`](https://github.com/sinonjs/referee-sinon/commit/1144e38811b0aa690418a04321b1f026b5491053)
  Use new mochfiy (Maximilian Antoni)
- [`6eca6e5`](https://github.com/sinonjs/referee-sinon/commit/6eca6e56481c8fd616bff156ece73a3ed2f52756)
  Drop node 12 and 14, support node 18 and 20 (Maximilian Antoni)
- [`30d712b`](https://github.com/sinonjs/referee-sinon/commit/30d712bd1c43223d08015a26e96db3725a1af5cf)
  Update GitHub actions (Maximilian Antoni)
- [`b1238cf`](https://github.com/sinonjs/referee-sinon/commit/b1238cf3fa0839d561cb769612770f4af7604a59)
  Upgrade Studio Changes (Maximilian Antoni)
- [`739f1d1`](https://github.com/sinonjs/referee-sinon/commit/739f1d10837ddb36c87a608c59ce8a58c967cd5b)
  npm audit (Maximilian Antoni)
- [`d61fcce`](https://github.com/sinonjs/referee-sinon/commit/d61fcce940059736b9f62a3297fc1f2981adc26e)
  Upgrade prettier to v3 and reformat files (Maximilian Antoni)
- [`97e28bf`](https://github.com/sinonjs/referee-sinon/commit/97e28bfce6fafeaa30498b0ec7e1708355bfcf50)
  Upgrade husky and lint-staged (Maximilian Antoni)
- [`bf9185d`](https://github.com/sinonjs/referee-sinon/commit/bf9185d00466af59cc22ce0fa913dd56baba79f0)
  Upgrade esbuild (Maximilian Antoni)
- [`bb7ee93`](https://github.com/sinonjs/referee-sinon/commit/bb7ee938767a584e0c5907a7100451f1c2750704)
  Upgrade @sinonjs/eslint-config (Maximilian Antoni)
- [`0ad59c9`](https://github.com/sinonjs/referee-sinon/commit/0ad59c9b47ea0dbaad5c94842e706dbf18b84f87)
  Update mocha (Maximilian Antoni)
- [`f235626`](https://github.com/sinonjs/referee-sinon/commit/f235626d01f4b3d08a38670f17ce2ec13b2b4dd7)
  Update @sinonjs/commons, @sinonjs/referee and sinon to latest (Maximilian Antoni)

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-12-29._

## 11.0.0

- [`45d4c2b`](https://github.com/sinonjs/referee-sinon/commit/45d4c2b77e4b9d54fca467e6a3c00f1116ea27c9)
  Upgrade referee and sinon (Maximilian Antoni)
- [`636daa8`](https://github.com/sinonjs/referee-sinon/commit/636daa89c8b7206e4bce7d5a42e8997c76df4eb9)
  Support import from es modules (Maximilian Antoni)
    >
    > Without explicitly naming all exports, this fails in es modules:
    > import { assert, refute, match, sinon } from '@sinonjs/referee-sinon';
    >
- [`74cfd6f`](https://github.com/sinonjs/referee-sinon/commit/74cfd6f3b34cca2b88c7551d7e396af38656e994)
  Fix pre-commit hook (Maximilian Antoni)
    >
    > The `npm bin` command is not supported anymore.
    >

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-01-24._

## 10.1.1

- [`81639a0`](https://github.com/sinonjs/referee-sinon/commit/81639a0f8c3d4fd4eb17d2df6af70ed23219f70d)
  Prefer @sinonjs/commons@2 (Morgan Roderick)
    >
    > That makes ES2017 support explicit
    >

_Released by Morgan Roderick on 2022-11-07._

## 10.1.0

- [`f473c75`](https://github.com/sinonjs/referee-sinon/commit/f473c7568157d5e3ca5e9dda53086c2f558e1ad4)
  Improve messages from calledOnceWith* (Morgan Roderick)
    >
    > Add support for differentianting between when a method has been called
    > an unexpected number of times and when it's been called with unexpected
    > arguments.
    >
    > The old message
    >
    > ```
    > [assert.calledOnceWith] Expected [Function (anonymous)] to be called once with arguments 1
    > ```
    >
    > Does not reveal whether the spy was called multiple times or with unexpected arguments
    >
    > After this changeset, there are two messages:
    >
    > ```
    > [assert.calledOnceWith] Expected [Function (anonymous)] to be called once, but was called 2 times
    > [assert.calledOnceWith] Expected [Function (anonymous)] to be called with arguments 2, but was called with 1
    > ```
    >
    > These messages clearly indicate which of the two combined expectations were unmet
    >
    > * calledOnceWith
    > * calledOnceWithExactly
    > * calledOnceWithMatch
    >

_Released by Morgan Roderick on 2021-07-27._

## 10.0.0

- [`b3fff89`](https://github.com/sinonjs/referee-sinon/commit/b3fff89c7c2a7346b7ddc80d6fd735754bd3fc1b)
  Upgrade @sinonjs/referee and sinon (Maximilian Antoni)
- [`f10af07`](https://github.com/sinonjs/referee-sinon/commit/f10af078af46e7b7c28e7ec9e410135829662493)
  Upgrade mocha and mochify (Maximilian Antoni)
- [`5196049`](https://github.com/sinonjs/referee-sinon/commit/5196049108c4a3a7af6e7df3f48e432f4ed8914e)
  Update @studio/changes (Maximilian Antoni)
- [`4808b73`](https://github.com/sinonjs/referee-sinon/commit/4808b7346525c896de8bd18d70022b48b1d09a2c)
  Update @sinonjs/eslint-config (Maximilian Antoni)
- [`1aeea11`](https://github.com/sinonjs/referee-sinon/commit/1aeea11a94effbea8e2e1ba1b6bf2f4f9f28f067)
  Update @sinonjs/commons (Maximilian Antoni)
- [`63ccf75`](https://github.com/sinonjs/referee-sinon/commit/63ccf75040002dd15af0f2fa4f5202c96ea4b31a)
  Use npm 7 (Maximilian Antoni)
- [`ac52972`](https://github.com/sinonjs/referee-sinon/commit/ac529729122bf3018a73cf20f3f9ae1c58f81055)
  Bump ws from 6.2.1 to 6.2.2 (dependabot[bot])
- [`36fb290`](https://github.com/sinonjs/referee-sinon/commit/36fb29080d266fb36cea0b9f46b14d73739ddeb9)
  Bump browserslist from 4.16.3 to 4.16.6 (dependabot[bot])
- [`aff4513`](https://github.com/sinonjs/referee-sinon/commit/aff451328af1b0caf7694a9d30c6bc771d9b78f5)
  Bump hosted-git-info from 3.0.5 to 3.0.8 (dependabot[bot])
- [`0d59268`](https://github.com/sinonjs/referee-sinon/commit/0d592683d904741f052c8eeb0d8425597a3a2cc6)
  Bump lodash from 4.17.20 to 4.17.21 (dependabot[bot])

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-08._

## 9.0.2

- [`37be940`](https://github.com/sinonjs/referee-sinon/commit/37be940cf2853d625746414d1e45bfc4c61f2f4a)
  Upgrade @sinonjs/referee to latest (Morgan Roderick)

_Released on 2021-04-27._

## 9.0.1

- [`f8b50ea`](https://github.com/sinonjs/referee-sinon/commit/f8b50ea458398ccea6c95457a37f88db7c35c97c)
  Bump y18n from 4.0.0 to 4.0.1 (dependabot[bot])
    >
    > Bumps [y18n](https://github.com/yargs/y18n) from 4.0.0 to 4.0.1.
    > - [Release notes](https://github.com/yargs/y18n/releases)
    > - [Changelog](https://github.com/yargs/y18n/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/yargs/y18n/commits)
    >
    > Signed-off-by: dependabot[bot] <support@github.com>

_Released on 2021-04-08._

## 9.0.0

- [`47e03e1`](https://github.com/sinonjs/referee-sinon/commit/47e03e18df3d68de2c1ad5e42a97ec2c2070a141)
  Use @sinonjs/eslint-config (Morgan Roderick)
    >
    > This drops support for legacy runtimes such as IE11, legacy Edge, Safari 9, etc. Minimum lagnuage support is now ES2017
    >

_Released on 2021-03-30._

## 8.0.1

- [`667058b`](https://github.com/sinonjs/referee-sinon/commit/667058b1b1ed4a6ae3bc0bb0a046f8b0e5550331)
  Add util package (Morgan Roderick)
    >
    > This improves browser support, as it is node internals
    >

_Released on 2021-01-07._

## 8.0.0

- [`eba2d3e`](https://github.com/sinonjs/referee-sinon/commit/eba2d3eb6be093ee84e165d1a38761659cb87fe5)
  Upgrade prettier to 2.x (Morgan Roderick)
    >
    > * upgrade `eslint-config-prettier`
    > * upgrade `eslint-plugin-prettier`
    > * run `prettier` on all JavaScript files
    >     ```sh
    >     $(npm bin)/prettier -w -u .
    >     ```
    >

  The `MAJOR` version bump is because the prettier defaults are incompatible
  with IE11 and Edge Legacy. Those two browsers are no longer supported.

_Released on 2020-11-16._

## 7.3.0

- [`8b0efed`](https://github.com/sinonjs/referee-sinon/commit/8b0efed86f13ec01a683cc1ed12bda0a18ea776d)
  Replace formatio with util inspect (#98) (Maximilian Antoni)

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2020-10-06._

## 7.2.0

- [`160b5bf`](https://github.com/sinonjs/referee-sinon/commit/160b5bfce23bb8a4100c9e2af084fb1a16a72930)
  Sinon 9.1 (#96) (Maximilian Antoni)
    >
    > Add `calledOnceWithMatch` assertion
    >

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2020-10-01._

## 7.1.0

- [`91ef947`](https://github.com/sinonjs/referee-sinon/commit/91ef947a8b9508c7dcd755c5a89763b580a99e61)
  Fix issues with undefined fakes (Maximilian Antoni)
    >
    > The tests where covering these cases, but the wrong regexp handling in
    > referee exception assertion used to let the tests pass anyway.
    >
    > See https://github.com/sinonjs/referee/pull/146
    >
- [`f5d9496`](https://github.com/sinonjs/referee-sinon/commit/f5d9496c4646426d00e38087cc48e6464c53bdee)
  Upgrade referee to v6 (Maximilian Antoni)

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2020-06-17._

## 7.0.2

- [`54f4e5d`](https://github.com/sinonjs/referee-sinon/commit/54f4e5d7cd208a0a566bd5697c678cb44a48633f)
  Fix sinon assertions with matchers (#83) (Maximilian Antoni)
    >
    > * Add failing test for issue with 2 samsam versions
    > * Upgrade referee to v5
    > * Reinstall dependencies
    >

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2020-02-28._

## 7.0.1

- [`78d7894`](https://github.com/sinonjs/referee-sinon/commit/78d7894556d0723b02e84d7cb44acccc834146d0)
  Bump @sinonjs/formatio (Morgan Roderick)
- [`1afe7d4`](https://github.com/sinonjs/referee-sinon/commit/1afe7d49879668b3903b183a3b9271aacb12db8b)
  Bump Sinon to latest (Morgan Roderick)

_Released on 2020-02-20._

## 7.0.0

- [`89b3f8d`](https://github.com/sinonjs/referee-sinon/commit/89b3f8d01ee44244d7322b11d646851960302994)
  Drop Node 8 support (Morgan Roderick)
    >
    > As can be seen at https://github.com/nodejs/Release, Node 8 reached
    > "end" of life on 2019-12-31, and is no longer actively supported.
    >
    > We will stop testing in Node 8 and start testing in Node 13, which will
    > become the next LTS release from April 2020.
    >

_Released on 2020-02-19._

## 6.0.1

- [`fb8c3d3`](https://github.com/sinonjs/referee-sinon/commit/fb8c3d3355a5d31434b01f291c373154330a0502)
  Upgrade Sinon to 8.0.3 (Morgan Roderick)
    >
    > Fixes #64
    >
- [`d00bf9e`](https://github.com/sinonjs/referee-sinon/commit/d00bf9ecb5680e275ac00a127b97016c277d0e8a)
  Add failing test for formatting fakes (Maximilian Antoni)
- [`3cc1c8e`](https://github.com/sinonjs/referee-sinon/commit/3cc1c8ed1501137a943cfc6ea39993385e3f8609)
  Bump rollup from 1.27.8 to 1.27.14 (dependabot-preview[bot])
    >
    > Bumps [rollup](https://github.com/rollup/rollup) from 1.27.8 to 1.27.14.
    > - [Release notes](https://github.com/rollup/rollup/releases)
    > - [Changelog](https://github.com/rollup/rollup/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/rollup/rollup/compare/v1.27.8...v1.27.14)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`2c17852`](https://github.com/sinonjs/referee-sinon/commit/2c178525475c18fba6eb195f5324204c9c89c9fd)
  Bump sinon from 8.0.1 to 8.0.2 (dependabot-preview[bot])
    >
    > Bumps [sinon](https://github.com/sinonjs/sinon) from 8.0.1 to 8.0.2.
    > - [Release notes](https://github.com/sinonjs/sinon/releases)
    > - [Changelog](https://github.com/sinonjs/sinon/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/sinonjs/sinon/compare/v8.0.1...v8.0.2)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`d7e27eb`](https://github.com/sinonjs/referee-sinon/commit/d7e27eb9e8164450af7387305a9aed015c91e8bd)
  Bump eslint from 6.7.2 to 6.8.0 (dependabot-preview[bot])
    >
    > Bumps [eslint](https://github.com/eslint/eslint) from 6.7.2 to 6.8.0.
    > - [Release notes](https://github.com/eslint/eslint/releases)
    > - [Changelog](https://github.com/eslint/eslint/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/eslint/eslint/compare/v6.7.2...v6.8.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`9274f0a`](https://github.com/sinonjs/referee-sinon/commit/9274f0a3c43e98dc37411ca658e233ace9ceedb1)
  Bump lint-staged from 9.4.1 to 9.5.0 (dependabot-preview[bot])
    >
    > Bumps [lint-staged](https://github.com/okonet/lint-staged) from 9.4.1 to 9.5.0.
    > - [Release notes](https://github.com/okonet/lint-staged/releases)
    > - [Commits](https://github.com/okonet/lint-staged/compare/v9.4.1...v9.5.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`14f3447`](https://github.com/sinonjs/referee-sinon/commit/14f3447a687ed8777f70d17486d151fe702051d8)
  Bump eslint-config-prettier from 6.7.0 to 6.9.0 (dependabot-preview[bot])
    >
    > Bumps [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) from 6.7.0 to 6.9.0.
    > - [Release notes](https://github.com/prettier/eslint-config-prettier/releases)
    > - [Changelog](https://github.com/prettier/eslint-config-prettier/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/prettier/eslint-config-prettier/commits/v6.9.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`77a9dd2`](https://github.com/sinonjs/referee-sinon/commit/77a9dd206256525d6bfac44b59e00bd2a795eebd)
  Bump eslint-plugin-prettier from 3.1.1 to 3.1.2 (dependabot-preview[bot])
    >
    > Bumps [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) from 3.1.1 to 3.1.2.
    > - [Release notes](https://github.com/prettier/eslint-plugin-prettier/releases)
    > - [Changelog](https://github.com/prettier/eslint-plugin-prettier/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/prettier/eslint-plugin-prettier/compare/v3.1.1...v3.1.2)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`8f04bd1`](https://github.com/sinonjs/referee-sinon/commit/8f04bd1220d006f29a249b7f23bc8d70fa1e9f5b)
  Bump nyc from 14.1.1 to 15.0.0 (dependabot-preview[bot])
    >
    > Bumps [nyc](https://github.com/istanbuljs/nyc) from 14.1.1 to 15.0.0.
    > - [Release notes](https://github.com/istanbuljs/nyc/releases)
    > - [Changelog](https://github.com/istanbuljs/nyc/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/istanbuljs/nyc/compare/v14.1.1...v15.0.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`1c2c2b8`](https://github.com/sinonjs/referee-sinon/commit/1c2c2b89719e7ad4c5aba058f0fb951e00ed6d92)
  6.0.0 (Morgan Roderick)

_Released on 2020-01-06._

## 6.0.0

- [`1f46f90`](https://github.com/sinonjs/referee-sinon/commit/1f46f9028845b2e03dd14438d560d1c9b83401cb)
  Upgrade to Referee 4 and Sinon 8 (Maximilian Antoni)

_Released on 2019-12-23._
