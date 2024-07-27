import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const client_id = "ooht58l1atsq8jiilhqg8ohq5827aw";

var expire_time = new Date();

export async function encrypt(payload) {
  // TODO: Actually incorporate encryption
  return await payload;
}

const fetchToken = async () => {
  return await fetch(
    "https://id.twitch.tv/oauth2/token?client_id=ooht58l1atsq8jiilhqg8ohq5827aw&client_secret=6oi55453w0ukfs34o3wpzzcw5uqz05&grant_type=client_credentials",
    {
      method: "POST",
    }
  );
};

export const Authorize = async () => {
  const response = await fetch(
    "https://id.twitch.tv/oauth2/token?client_id=ooht58l1atsq8jiilhqg8ohq5827aw&client_secret=6oi55453w0ukfs34o3wpzzcw5uqz05&grant_type=client_credentials",
    {
      method: "POST",
    }
  );
  const auth = await response.json();
  const expiry = Date.now() + (await auth.expires_in) * 1000;
  console.log(await auth.access_token);

  const fresh_token = await auth.access_token;

  cookies().set("session", fresh_token, { expiry, httpOnly: true });
  return await auth.access_token;
};

export const CheckAuthorization = async (request) => {
  const session = await request.cookies.get("session")?.value;
  if (session) {
    console.log("Active session found");
    return;
  }

  console.log("Generating new token");
  // Get a new token if no active one
  const response = NextResponse.next();
  const data = await fetchToken();
  const auth = await data.json();
  const expiry = Date.now() + (await auth.expires_in) * 1000;
  const fresh_token = await auth.access_token;

  console.log(`New Token: ${await fresh_token}\nExpires in: ${await expiry}`);

  response.cookies.set("session", fresh_token, { expiry, httpOnly: true });
  return response;
};

export const getAccessToken = () => {
  const session = cookies().get("session")?.value;
  return session;
};
