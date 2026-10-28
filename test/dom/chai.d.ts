// chai 5 ships without typings; the suite only needs expect.
declare module 'chai' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const expect: any;
}
