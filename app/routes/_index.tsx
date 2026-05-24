import { redirect } from "@remix-run/react";

export const clientLoader = () => {
  return redirect("colorDatabase");
};

clientLoader.hydrate = true;

export default function Index() {
  return null;
}
