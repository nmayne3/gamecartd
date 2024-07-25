

const GetGame = async (): Promise<Game> => {
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": await auth.client_id,
        Authorization: "Bearer " + (await auth.access_token),
      },
      body: `fields *, keywords.name, cover.*, artworks.*, genres.*, involved_companies.*; sort aggregated_rating desc; limit 1;`,
    });
    console.log("Slug page response status: " + response.status);
    // Authorization Error
    if (response.status == 401) {
      // Refresh token
      console.log(await response.clone().json());
    }
    const game = response.json();
    return game;
};
  