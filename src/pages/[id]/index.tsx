import { useRouter } from "next/router";

export default function Planning() {
  const router = useRouter();

  return (
    <>
      <h1>{router.query.id}</h1>
    </>
  );
}
