# Documentation

### How to publish a graphql module to nexus

Follow these steps to publish a package to nexus for use in graphql pipeline:

- `pnpm run generate` from the inuits-dams-frontend directory
- `pnpm run build` from in the directory of the module you want to publish
- Bump `package.json` version
- Commit new `package.json` and other changes inside the grapql module
- `pnpm publish`
