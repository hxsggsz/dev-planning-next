import { Navbar } from "@/components/ui/navbar";
import { api } from "@/utils/api";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface PropTypes {
  id: string;
}

export default function Planning({ id }: PropTypes) {
  const router = useRouter();
  const ctx = api.useContext();

  const searchRoom = api.room.searchRoom.useQuery({ id });
  const removeUserRoom = api.room.removeUserRoom.useMutation({
    onSuccess: () => ctx.invalidate(),
  });

  function removeUser(userToRemoveId: string) {
    const userId = localStorage.getItem("@me");
    removeUserRoom.mutate({ roomId: id, userToRemoveId, userAdminId: userId! });
  }

  return (
    <main className="flex min-h-screen w-full">
      <Navbar removeUser={removeUser} list={searchRoom.data?.users} />
      <h1>{router.query.id}</h1>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;

  if (!id) {
    return {
      redirect: {
        destination: "/",
      },
      props: {},
    };
  }

  return {
    props: {
      id: id.toString(),
    },
  };
};
