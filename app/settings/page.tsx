import Backdrop from "@/components/backdrop";
import Login from "../(auth)/login/page";
import { getSession } from "../api/auth/[...nextauth]/auth";
import { GetUserFromID } from "../api/games/actions";
import EditUserForm from "@/components/user/edit/editUserForm";
import prisma from "@/lib/prisma";

/**
 *
 * Settings page for editing a user's profile.
 * If a user is not logged in, it returns the profile page instead.
 *
 */

const SettingsPage = async () => {
  const session = await getSession();
  // Display login page if user isn't logged in
  if (!session?.user.id) {
    return <Login />;
  }
  //const user = await GetUserFromID(session.user.id);
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      favoriteGames: { include: { game: true }, orderBy: { rank: "asc" } },
    },
  });
  if (!user) {
    return <Login />;
  }
  return (
    <main className="min-h-fit">
      <Backdrop />
      <div className="flex flex-col max-w-3xl lg:max-w-screen-lg mx-auto *:z-10 h-fit bg-background py-8">
        <h1 className="font-sans font-light text-3xl text-foreground z-10 py-8">
          {" "}
          Account Settings{" "}
        </h1>{" "}
        <h2 className="text-xl text-white py-6"> Profile </h2>
        <section id="form">
          <EditUserForm user={user} />
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
