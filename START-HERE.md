# IntelHub viewer — leave your existing tools unchanged

Use this package instead of the earlier combined-pipelines ZIP.

News-Radar stays exactly as it is. DNLAutomation stays exactly as it is.
This is a NEW, separate IntelHub repository that reads their finished reports. It does not run their scanners, change their files, change their schedules or send emails. No Gemini/Groq keys are needed here.

## 1. Create the new website repository

In GitHub create a new repository under Medtech-platform called IntelHub, with main as the default branch. Extract this ZIP, open IntelHub-Viewer, and upload its CONTENTS into the new repository. Do not upload into News-Radar or DNLAutomation.

At the top level you should see index.html, integration.js, sync_reports.py, requirements.txt, START-HERE.md and the .github folder. If .github is hidden or missed, use Add file > Create new file in GitHub, enter `.github/workflows/publish.yml` as the filename, and paste the full contents of that supplied local file.

The usual free GitHub Pages setup uses a public repository and public website. Only publish reports approved for public sharing. This package publishes copies of DNL Excel reports as well as News Radar reports. The DNL reports currently being in a public repository does not by itself mean anonymous visitors can download its Actions artifacts. Publishing them on Pages broadens access. There is no secure client login in this viewer. Private/client-restricted hosting requires a different hosting/access setup.

## 2. Give the new viewer permission to READ DNL reports

GitHub requires authenticated access to download Actions report artifacts. Create one narrowly scoped token:

- GitHub profile picture > Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token.
- Name: IntelHub report reader. Choose an expiration date you can track.
- Resource owner: Medtech-platform (or the account that owns that repository).
- Repository access: Only select repositories > DNLAutomation.
- Repository permissions: Actions = Read-only. Metadata read access is automatic. No write permissions are needed.
- Generate the token. If organisation approval is required, wait for approval.
- Copy it into the NEW IntelHub repository: Settings > Secrets and variables > Actions > New repository secret.
- Secret name: INTELHUB_READ_TOKEN. Paste the token into its value and save.

Do not send the token in chat or paste it into a code file. It remains in GitHub's workflow secrets and is not included in the website. It does not modify DNLAutomation. Renew this secret when its token expires.

## 3. Publish IntelHub

- In the NEW IntelHub repository: Settings > Pages > Build and deployment > Source = GitHub Actions.
- Open Actions > Update IntelHub viewer > Run workflow > main > Run workflow.
- Wait for the workflow to complete. If the initial upload triggered a failed run before the secret/Pages setup, simply run it again after these steps.
- Settings > Pages shows the actual shareable address. For Medtech-platform/IntelHub, the expected address is https://medtech-platform.github.io/IntelHub/ .

No setup or changes are needed inside either existing source repository.

## What you will see

Choose RxBenefits / News Radar or Immunodiagnostics / DNL from the left dropdown. Select a report date, search articles, open original sources, or download the original Excel report. Newsletter Report prints the selected available report. IntelHub keeps the supplied visual design.

The viewer refreshes approximately every three hours, after your existing tools generate their reports. GitHub schedules can be delayed. To refresh sooner, run Update IntelHub viewer in the NEW repository. The webpage Refresh button reloads already-published data; it does not trigger a scan or a GitHub workflow.

News Radar: reads existing JSON and Excel output at your current github.io address; discovers filenames from your current public repository's docs/data directory.
DNL: reads up to 20 newest retained DNL-Report artifacts from completed runs on the default branch, converts their Excel rows into displayable data, and includes the original Excel downloads. Reports attached to failed workflow runs are marked with the source workflow status, because a failure can occur after Excel generation (for example, during email delivery). Screening quality and completeness remain those of your existing tools. Expired artifacts cannot be recovered by this viewer.

Nothing in this package creates new research findings. The other IntelHub analytics layouts remain illustrative or explicitly not connected. The uploaded HTML's demo sign-in was not security; this viewer clearly presents a public workspace.

## Troubleshooting

- HTTP 401/403/404 in Read existing reports: check token expiration, selected repository, Actions read permission and organisation approval. GitHub API rate limits can also cause 403. No personal token belongs in the webpage.
- No DNL reports: check whether the original workflow has retained DNL-Report artifacts. This viewer does not change or run that workflow.
- Missing new News Radar report: it must first be published by your existing workflow at its current website address. Retry the viewer later.
- Viewer fails to update: a failed sync stops deployment and leaves the last successful website in place. Report dates show which data you are seeing.
- Browser shows 404: verify the NEW repository's Pages source is GitHub Actions and its workflow deployment passed.

## Verification and limits

The source API confirmed DNLAutomation is public with main as its default branch and recent DNL-Report artifacts. News Radar's docs/data folder was accessible. JavaScript/Python syntax and isolated Excel conversion are checked in preparation. Full artifact download needs your token; live end-to-end sync, browser rendering and GitHub deployment are not verified here. No changes were made to either existing repository.

Official GitHub guidance:
https://docs.github.com/en/rest/actions/artifacts
https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
