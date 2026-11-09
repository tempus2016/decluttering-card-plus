# Visual check

`scripts/visual.js` writes `examples/demo-dashboard.yaml` into a dashboard called `dcp-all-visual`, screenshots every view at 1280 and 388 px wide, and compares each image with a baseline. A screen that differs by more than 0.1% of its pixels, or changes size, fails the run. Its before, after and diff images go to `test/visual/out/`. Every capture also goes to `test/visual/out/actual/`.

The card under test is always the local build. The browser's requests for `/local/decluttering-card-plus*.js` are answered from `dist/` (or `VISUAL_DIST`), so whatever the Home Assistant has installed does not matter, as long as the dashboard loads the card from `/local/decluttering-card-plus.js`. The run stops if the page never asks for it.

The script never changes the Home Assistant user's language. It only writes the `dcp-all-visual` dashboard and refuses to overwrite one it did not create. It also sets a `sun.visual_check` state, so the demo does not follow the clock.

## Two baselines

| Folder | Taken on | Used by |
|---|---|---|
| `test/visual/baseline/` | ha-dev through browserless | `npm run test:visual` |
| `test/visual/baseline-ci/` | the fresh Home Assistant in `.github/workflows/visual.yml` | the Screens workflow |

The two cannot share images: they run different Home Assistant versions with different entities and fonts.

## Local (ha-dev)

```bash
npm run build                          # or npm run rollup
npm run test:visual                    # compare with test/visual/baseline/
npm run test:visual -- --update        # take a new baseline, then commit test/visual/baseline/
```

Settings: `VISUAL_HA` (default `http://localhost:8123`), `VISUAL_TOKEN` or `VISUAL_TOKEN_FILE` (a long-lived access token, or a file holding one), `VISUAL_CDP` (the browser to drive over CDP; required unless `--local`), `VISUAL_DIST` (default `dist/`).

Exit codes: 0 all match, 1 a screen differs, 2 the run broke, 3 nothing differs but some screens have no baseline.

## CI

The Screens workflow runs on pull requests that touch the card, the demo or the check. It is not a required check.

It runs `npm run test:visual -- --local --baseline test/visual/baseline-ci`. `--local` starts a Chromium of the runner's own in place of browserless (`VISUAL_CDP` is not used), and points it at the Home Assistant the workflow starts in Docker (`VISUAL_HA`). Run it the same way on your own machine with `npx playwright install chromium` first; ha-dev runs go through browserless, so leave `--local` off there.

- **Baseline present:** the screens are compared. A difference fails the job, and the before, after and diff images are uploaded as the `screens` artifact.
- **Baseline missing:** nothing can be compared. The job passes with a warning annotation and a job summary, and uploads the captures as the `screens` artifact under `actual/`.

### Making or refreshing the CI baseline

1. Run the Screens workflow (on a pull request, or with Run workflow on the branch).
2. Download the `screens` artifact from the run and unzip it. You can use the run page, or the REST API with the artifact id: `curl -L -H "Authorization: Bearer $TOKEN" -o screens.zip https://api.github.com/repos/tempus2016/decluttering-card-plus/actions/artifacts/<id>/zip`.
3. Look through `actual/*.png`. They become the reference, so check them.
4. Copy them into the baseline and commit:

   ```bash
   npm run test:visual -- --accept path/to/screens --baseline test/visual/baseline-ci
   git add test/visual/baseline-ci/
   ```

5. The next run compares against them.

Accepting an intended change works the same way: the failed run's `actual/` folder holds the new screens.

Home Assistant is pinned in the workflow, because a new release can change how cards render. Bump the image tag and refresh `baseline-ci/` in the same pull request.
