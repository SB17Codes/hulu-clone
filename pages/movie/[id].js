import Image from "next/dist/client/image";
import {
  ThumbUpIcon,
  PlayIcon,
  PlusIcon,
  UserGroupIcon,
  XIcon,
} from "@heroicons/react/outline";
import Head from "next/dist/shared/lib/head";
import { useState } from "react";
import ReactPlayer from "react-player";

const Movie = ({ result }) => {
  console.log(result);
  const BASE_URL = "https://image.tmdb.org/t/p/original";

  const [showPlayer, setShowPlayer] = useState(false);

  const index = result.videos.results.findIndex(
    (element) => element.type === "Trailer"
  );
  console.log(index);
  return (
    <div>
      <Head>
        <title> {result.title || result.original_name}</title>
      </Head>
      <section className="relative z-50">
        <div className="relative min-h-[calc(100vh)] ">
          <Image
            src={
              `${BASE_URL}${result.backdrop_path}` ||
              `${BASE_URL}${result.poster_path}`
            }
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="absolute inset-y-28 md:inset-y-auto md:bottom-10 inset-x-4 md:inset-x-12 space-y-6 z-50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {result.title || result.original_name}
          </h1>
          <div className="flex items-center space-x-3 md:space-x-5 ">
            <button className="text-xs bg-[#f9f9f9] w-auto text-black flex items-center justify-between py-[5px] px-[20px] rounded hover:bg-[#c6c6c6] ">
              <PlayIcon className="h-6 md:h-10" />
              <span className="uppercase font-medium tracking-wide">Play</span>
            </button>

            <button
              onClick={() => setShowPlayer(true)}
              className="text-xs md:text-base bg-black/30 text-[#f9f9f9] border border-[#f9f9f9]  flex items-center justify-center py-[5px] px-[20px] rounded hover:bg-[#c6c6c6] hover:text-black "
            >
              <PlayIcon className="h-6 md:h-10" />
              <span className="uppercase font-medium tracking-wide">
                Trailer
              </span>
            </button>
            <div className="rounded-full border-2 text-white border-white flex items-center justify-center w-11 h-11 cursor-pointer bg-black/30 hover:bg-[#c6c6c6] hover:text-black">
              <PlusIcon className="h-6" />
            </div>
            <div className="rounded-full border-2 text-white border-white flex items-center justify-center w-11 h-11 cursor-pointer bg-black/30 hover:bg-[#c6c6c6] hover:text-black">
              <UserGroupIcon className="h-6" />
            </div>
          </div>
          <p className="text-xs md:text-sm text-white">
            {" "}
            {result.release_date || result.first_air_date} •{" "}
            {Math.floor(result.runtime / 60)}h {Math.floor(result.runtime % 60)}
            m • {result.genres.map((genre) => genre.name + " ")}
          </p>
          <h4 className="text-xs md:text-lg max-w-4xl text-white">
            {result.overview}
          </h4>
        </div>
        {showPlayer && (
          <div className="absolute inset-0 bg-black opacity-50 h-full w-full z-50" />
        )}
        <div
          className={`absolute top-3 inset-x-[7%] md:inset-x-[13%] rounded overflow-hidden transition duration-1000 ${
            showPlayer ? "opacity-100 z-50" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between bg-black text-[#f9f9f9] p-3.5">
            <span className="font-semibold">Play Trailer</span>
            <div
              className="cursor-pointer w-8 h-8 flex justify-center items-center rounded-lg opacity-50 hover:opacity-75 hover:bg-[#0F0F0F]"
              onClick={() => setShowPlayer(false)}
            >
              <XIcon className="h-5" />
            </div>
          </div>
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${result.videos?.results[index]?.key}`}
              width="100%"
              height="100%"
              style={{ position: "absolute", top: "0", left: "0" }}
              controls={true}
              playing={showPlayer}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Movie;

export async function getServerSideProps(context) {
  const API_KEY = process.env.API_KEY;

  const { id } = context.query;
  const request = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`
  ).then((response) => response.json());

  return {
    props: {
      result: request,
    },
  };
}
