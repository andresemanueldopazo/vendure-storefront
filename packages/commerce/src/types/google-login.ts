export type GoogleLoginBody = {
  token: string
}

export type GoogleLoginTypes = {
  body: GoogleLoginBody
}

export type GoogleLoginHook<T extends GoogleLoginTypes = GoogleLoginTypes> = {
  data: string | null
  actionInput: GoogleLoginBody
  fetcherInput: GoogleLoginBody
  body: T['body']
}
