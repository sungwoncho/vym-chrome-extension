export default function debug(...msg) {
  if (!__VYM_IS_PRODUCTION__) {
    console.log(...msg);
  }
}
