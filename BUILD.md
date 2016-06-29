# Build instructions

1. Building dev bundle

  ```
  npm run build.dev -- --base "/context/path/"
  ```

  Bundle is built in directory dist/dev


2. Building prod bundle

  ```
  npm run build.prod -- --base "/context/path/"
  ```

  Bundle is built in directory dist/prod


3. Packaging as webjar

  ```
  npm run maven.install.prod -- --groupId com.example --version 1.0.0-SNAPHSOT
  ```

  This script requires maven is installed on local system.  

  Resulting webjar is installed in local maven repository.

