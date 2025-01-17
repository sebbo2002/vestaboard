## [4.0.1](https://github.com/sebbo2002/vestaboard/compare/v4.0.0...v4.0.1) (2025-01-09)


### Bug Fixes

* **deps:** downgrade eslint to v9.13.0 to resolve typescript-eslint issue ([ccef307](https://github.com/sebbo2002/vestaboard/commit/ccef30747b18cbec9d1df591a46394dadbabec60)), closes [#10353](https://github.com/sebbo2002/vestaboard/issues/10353) [typescript-eslint/typescript-eslint#10353](https://github.com/typescript-eslint/typescript-eslint/issues/10353)

# [4.0.0](https://github.com/sebbo2002/vestaboard/compare/v3.1.0...v4.0.0) (2024-08-26)


### chore

* Drop support for node.js v19 and v21 ([2fff079](https://github.com/sebbo2002/vestaboard/commit/2fff079040a377fbe9ecc340388f6a29b863cf80))


### Features

* **Message:** Add more auto-replaced characters ([9495ba4](https://github.com/sebbo2002/vestaboard/commit/9495ba41331f97de4fe623756d5a8ea090260ddc))


### BREAKING CHANGES

* Drop node.js v21 Support

These node.js versions are no longer supported. For more information see https://nodejs.dev/en/about/releases/

# [3.1.0](https://github.com/sebbo2002/vestaboard/compare/v3.0.0...v3.1.0) (2024-01-07)


### Features

* Remove node-fetch dependency ([4d6911f](https://github.com/sebbo2002/vestaboard/commit/4d6911f5ab5b547d3932f307ab935e73e6ad5bcc))


### Reverts

* Revert "ci: Downgrade is-semantic-release till it's fixed" ([91c2ab5](https://github.com/sebbo2002/vestaboard/commit/91c2ab59d0559a060c11d07973382c465dd3345d))

## [3.0.1-develop.1](https://github.com/sebbo2002/vestaboard/compare/v3.0.0...v3.0.1-develop.1) (2023-08-23)

# [3.0.0](https://github.com/sebbo2002/vestaboard/compare/v2.0.0...v3.0.0) (2023-06-14)


### Build System

* Deprecate node.js v14 / v17 ([7a2de45](https://github.com/sebbo2002/vestaboard/commit/7a2de45c12f19a1ec441b3a004f4aa935efc197c))


### BREAKING CHANGES

* The node.js versions v14 and v17 are no longer maintained and are therefore no longer supported. See https://nodejs.dev/en/about/releases/ for more details on node.js release cycles.

# [3.0.0-develop.1](https://github.com/sebbo2002/vestaboard/compare/v2.0.1-develop.1...v3.0.0-develop.1) (2023-06-14)


### Build System

* Deprecate node.js v14 / v17 ([7a2de45](https://github.com/sebbo2002/vestaboard/commit/7a2de45c12f19a1ec441b3a004f4aa935efc197c))


### BREAKING CHANGES

* The node.js versions v14 and v17 are no longer maintained and are therefore no longer supported. See https://nodejs.dev/en/about/releases/ for more details on node.js release cycles.

## [2.0.1-develop.1](https://github.com/sebbo2002/vestaboard/compare/v2.0.0...v2.0.1-develop.1) (2023-05-02)

# [2.0.0](https://github.com/sebbo2002/vestaboard/compare/v1.0.1...v2.0.0) (2023-03-31)


### Bug Fixes

* Add .js extension ([adaa3d0](https://github.com/sebbo2002/vestaboard/commit/adaa3d01bea7a8844b7e8f0cae0b23f683ba6ae9))


### Build System

* Deprecate node.js 12 ([426588b](https://github.com/sebbo2002/vestaboard/commit/426588b4bb7bde2924bbc92006ca839e960872e1))


### Features

* Use `import()` for `node-fetch` to allow cjs usage ([5f768c0](https://github.com/sebbo2002/vestaboard/commit/5f768c07084544c20ac54bdf03346f43117dbf77))


### BREAKING CHANGES

* From now on, only node.js ^14.8.0 || >=16.0.0 are supported

# [2.0.0-develop.2](https://github.com/sebbo2002/vestaboard/compare/v2.0.0-develop.1...v2.0.0-develop.2) (2023-03-31)


### Features

* Use `import()` for `node-fetch` to allow cjs usage ([5f768c0](https://github.com/sebbo2002/vestaboard/commit/5f768c07084544c20ac54bdf03346f43117dbf77))

# [2.0.0-develop.1](https://github.com/sebbo2002/vestaboard/compare/v1.0.1...v2.0.0-develop.1) (2023-02-12)


### Bug Fixes

* Add .js extension ([adaa3d0](https://github.com/sebbo2002/vestaboard/commit/adaa3d01bea7a8844b7e8f0cae0b23f683ba6ae9))


### Build System

* Deprecate node.js 12 ([426588b](https://github.com/sebbo2002/vestaboard/commit/426588b4bb7bde2924bbc92006ca839e960872e1))


### BREAKING CHANGES

* From now on, only node.js ^14.8.0 || >=16.0.0 are supported

## [1.0.1](https://github.com/sebbo2002/vestaboard/compare/v1.0.0...v1.0.1) (2023-02-08)

## [1.0.1-develop.3](https://github.com/sebbo2002/vestaboard/compare/v1.0.1-develop.2...v1.0.1-develop.3) (2023-02-08)

## [1.0.1-develop.2](https://github.com/sebbo2002/vestaboard/compare/v1.0.1-develop.1...v1.0.1-develop.2) (2022-12-04)

## [1.0.1-develop.1](https://github.com/sebbo2002/vestaboard/compare/v1.0.0...v1.0.1-develop.1) (2022-11-13)

# 1.0.0 (2022-08-23)


### Bug Fixes

* **CI:** Fix DockerHub container release ([01b7534](https://github.com/sebbo2002/vestaboard/commit/01b753406d1f1ef24a949c7d7b946d99b779d013))


### Build System

* Native ESM support ([7b86a4f](https://github.com/sebbo2002/vestaboard/commit/7b86a4f1187c387a3a5792e1fb72d822b04e3631))


### chore

* Remove node.js 10 Support ([2b910c0](https://github.com/sebbo2002/vestaboard/commit/2b910c09bc8a41085fc4472159494d8738d5521e))


### Features

* First commit 🪴 ([2990f59](https://github.com/sebbo2002/vestaboard/commit/2990f59684e5327df6b7dbee587f5dd5cc5cf148))


### BREAKING CHANGES

* Only Support for node.js ^12.20.0 || >=14.13.1
* Removed support for node.js v10

# [1.0.0-develop.2](https://github.com/sebbo2002/vestaboard/compare/v1.0.0-develop.1...v1.0.0-develop.2) (2022-08-22)

# 1.0.0-develop.1 (2022-08-16)


### Bug Fixes

* **CI:** Fix DockerHub container release ([01b7534](https://github.com/sebbo2002/vestaboard/commit/01b753406d1f1ef24a949c7d7b946d99b779d013))


### Build System

* Native ESM support ([7b86a4f](https://github.com/sebbo2002/vestaboard/commit/7b86a4f1187c387a3a5792e1fb72d822b04e3631))


### chore

* Remove node.js 10 Support ([2b910c0](https://github.com/sebbo2002/vestaboard/commit/2b910c09bc8a41085fc4472159494d8738d5521e))


### Features

* First commit 🪴 ([2990f59](https://github.com/sebbo2002/vestaboard/commit/2990f59684e5327df6b7dbee587f5dd5cc5cf148))


### BREAKING CHANGES

* Only Support for node.js ^12.20.0 || >=14.13.1
* Removed support for node.js v10
