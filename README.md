# Documentation

### Generate new types manualy inside container

If the automatic type generation inside of the container fails to pick up your changes use these steps to generate them manually:

- `docker exec -it dams-graphql-1 ash`
- Go to the app directory: `cd ../`
- `pnpm run generate` (this also works in the inuits-dams-graphql-service directory but is only for use inside of the pipelines)

### How to publish a graphql module to nexus

Follow these steps to publish a package to nexus for use in graphql pipeline:

- `pnpm run generate` from the inuits-dams-frontend directory
- `pnpm run build` from in the directory of the module you want to publish
- Bump `package.json` version
- Commit new `package.json` and other changes inside the grapql module
- `pnpm publish`
