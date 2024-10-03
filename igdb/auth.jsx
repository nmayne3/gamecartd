import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

var expire_time = new Date();

export async function encrypt(payload) {
  // TODO: Actually incorporate encryption
  return await payload;
}

const fetchToken = async () => {
  return await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );
};

export const Authorize = async () => {
  if (
    process.env.client_id === undefined ||
    process.env.client_secret === undefined
  ) {
    throw new Error("Invalid env vars");
  }
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=client_credentials`,
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
  const response = NextResponse.next();
  if (session) {
    console.log("Active session found");
    return response;
  }

  console.log("Generating new token");
  // Get a new token if no active one
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
