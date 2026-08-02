"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MovieTypes } from "@/types/types";

export default function useMovieById({
  media_type,
  tmdbId,
  language,
}: {
  media_type: string;
  tmdbId: string;
  language: string;
}) {
  const query = useQuery<MovieTypes>({
    queryKey: ["get-by-id", tmdbId, media_type],
    queryFn: async () => {
      const url = `https://api.themoviedb.org/3/${media_type}/${tmdbId}?api_key=47a1a7df542d3d483227f758a7317dff&language=${language}&append_to_response=credits,images,videos,recommendations,external_ids`;

      try {
        const res = await axios.get(url);

        return res.data;
      } catch (error) {
        console.error(error);
        throw error; // 🔥 Important: NEVER return undefined
      }
    },
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });

  return query;
}
