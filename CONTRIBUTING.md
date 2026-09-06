
## Reporting bugs and suggestions

1. Make sure both your **browser** and **StyleTower** are up to date.
2. Disable your other extensions & scripts to identify conflicts.
3. If your issue persists, open a [new issue](https://github.com/vampiricwulf/StyleTower/issues) with the following information:
  1. Precise steps to reproduce the problem, with the expected and actual results.
  2. Console errors, if any.
  3. Browser version.

Open your console with:
- `Ctrl + Shift + J` on Chrome.
- `Ctrl + Shift + K` on Firefox.

## Development & Contribution

### Get started

- Install [node.js](http://nodejs.org/).
- Clone StyleTower.
- `cd` into it.
- Install/Update StyleTower dependencies with `npm install`.

### Build

- Build with `npm run build` (or `npx grunt build`); outputs land in `builds/`.

### Test

- Run `npm test`: it builds the processed script into `tmp/` and runs the jsdom suite under `test/` with Node's built-in test runner.

### Lint

StyleTower uses [ESLint](https://eslint.org/) with the flat config format (`eslint.config.mjs`).

**Command line:**
```
npm run lint                    # check src/ for errors
npx eslint src/                 # same, without the npm script
```

**VSCode integration:**

Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Config notes:**

- `src/meta/` and `src/style.js` are excluded
  - These contain grunt template syntax (`<%= %>`) that ESLint cannot parse
- Custom globals (`$`, `$lib`, `$SS`, `$docBody`, `$docHead`, `TCaptcha`) are declared

**Fix common issues:**

```
npx eslint src/ --fix    # auto-fix formatting issues only
```

### Release

- Bump the version and rebuild with `npx grunt patch`, `npx grunt minor` or `npx grunt major`; each prepends a `### vX` stub to the changelog to fill in.
- Tag the commit and publish the `builds/` outputs as a GitHub release.

Note: this is only used to release new StyleTower versions, and is **not** needed or wanted in pull requests.

### Contribute

- Edit the sources.
- Open a pull request to merge branch.
