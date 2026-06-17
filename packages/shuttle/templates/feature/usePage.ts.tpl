import { useFetch } from "@web/lib/useFetch";
import { api } from "@web/api/client";

export function use{{Feature}}Page() {
  return useFetch(api.{{feature}}List);
}
