export var access_token;
export const client_id = "ooht58l1atsq8jiilhqg8ohq5827aw";

export const Authorize = async () => {
  return await fetch(
    "https://id.twitch.tv/oauth2/token?client_id=ooht58l1atsq8jiilhqg8ohq5827aw&client_secret=6oi55453w0ukfs34o3wpzzcw5uqz05&grant_type=client_credentials",
    {
      method: "POST",
    }
  )
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(data.token_type);
      console.log(data.access_token);
      access_token = data.access_token;
    });
};
