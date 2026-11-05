export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Dependabot bodies carry long release-note lines and URLs.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
}
