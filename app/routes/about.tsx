import type { Route } from "./+types/about";
import hazelScottCover from "~/assets/hazel-scott-cover.webp";
import dizzyCover from "~/assets/dizzy-cover.webp";
import robertAbbottCover from "~/assets/robert-abbott-cover.webp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Susan Engle - Iambic Nana" },
    { name: "description", content: "Learn about poet Susan Engle" },
  ];
}

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-8">
          About Susan Engle
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Susan Engle spent her childhood having adventures in the woods and reading by flashlight under the covers at night, because there just wasn‘t enough time to finish all the books from the library during the day. She fell in love with singing, the local summer theatre, and her neighbor‘s cabinet of miniatures. After finishing high school in Michigan, she returned to her childhood home, Granville, Ohio, and earned a BFA in Theatre Arts from Denison University in 1972. She nurtured her love of music by working as an apprentice at the Metropolitan Opera in New York and traveling throughout Europe and the United States as a soloist with various choirs and with a folk/rock band. She has also worked as a stage manager for operas produced by the New Mexico Symphony Orchestra and spent college summers in Actors‘ Equity summer stock at the Barn Theater in Augusta, Michigan.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            After her twin daughters were born in 1973, Susan began writing songs and poems for children, publishing more than 70 over the years, including the award-winning “Come and Sing” CD. This first CD was followed by “Loving Hands”, “Special Times”, and “Arm in Arm”, which won a Religion Communicator‘s Council Best of Class Award and an Angel Award from Excellence in Media in 2009. Susan joined the staff of <em>Brilliant Star</em> children‘s magazine in 1995 as an editor and writer. In 2012, she contributed poetry to Jacqueline Mehrabi‘s <em>Bahá'í Holy Days: Stories and Poems for Children</em>. In 2016, Susan created her first tiny book, <em>The Bahá‘í Faith: A Tiny Introduction</em>, followed by <em>A Tiny Book of Prayers</em> and a Spanish version of the Tiny Introduction. <em>A Soul Is Forever: A Tiny Book of Comfort</em>, the most recent tiny book, was published in 2021. She is retired from her editorial work for <em>Brilliant Star</em>, but continues to write and edit new projects from her home that houses a collection of miniatures in West Lafayette, Indiana.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Hazel Scott Biography Is Now Available!
            </h2>
            <img 
              src={hazelScottCover} 
              alt="Hazel Scott book cover" 
              className="float-left mr-6 mb-4 w-48 h-auto rounded-lg shadow-md"
            />
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              In 1928, Hazel Scott succeeded in auditioning to receive instruction on the piano at Juilliard School in New York City. She was then eight years old at a time when attendance at Juilliard was limited mostly to white males who were sixteen and older. It was a remarkable achievement that foreshadowed her later success in the music business.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Thanks to her friendship with Billie Holliday, Fats Waller, and especially Art Tatum, her musical training was broadened by these shining stars of jazz music, and she became a well-known performer in the United States for jazzing up the classics on the piano. Hazel also advocated for the rights of African Americans by insisting on performing only for audiences that did not separate black and white audience members and by refusing to play roles in films that were demeaning to African-American women. The story told in <em>Hazel Scott: A Woman, a Piano, and a Commitment to Justice</em> of the triumph of her rise to fame and the sadness of her fall from stardom – thanks to Senator Joseph McCarthy and the House (of Representatives) Un-American Activities Committee – is absorbing. All along the way, she raised her voice in defense of her people and received recognition from Dr. Martin Luther King, Jr. and the Black Filmmakers Hall of Fame for doing so. In the final years of her life, she wrote, "Any woman who has a great deal to offer the world is in trouble. And if she's a black woman, she's in deep trouble."
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 clear-left">
              This biography won a five-star review from Readers' Favorite Book Review and Awards in 2021, before it's official publication!
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-200 mb-4">
              The Second Book in the Change Maker Series
            </h2>
            <img 
              src={dizzyCover} 
              alt="Dizzy Gillespie book cover" 
              className="float-right ml-6 mb-6 w-48 h-auto rounded-lg shadow-md"
            />
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <em>John Birks "Dizzy" Gillespie: A Man, a Trumpet, and a Journey to Bebop</em> is in bookstores listed below. Jazz-lovers will already be aware of this icon of 20th Century music. Now kids will get a chance to be inspired by a narrative of his amazing energy, love of rhythm and chord progressions, and musical accomplishments. The book won a Best in Class from the DeRose-Hinkhouse Awards judged by the Religion Communicators Council in 2021, plus a five-star review from Readers' Favorite Book Reviews and Awards in 2020.
            </p>
            <div className="mb-4">
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/wNTLSXWUR3U" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="rounded-lg shadow-md max-w-full"
              ></iframe>
            </div>
          </section>

          <section className="mb-12 clear-both">
            <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-200 mb-4">
              The First Book in the Change Maker Series
            </h2>
            <img 
              src={robertAbbottCover} 
              alt="Robert Abbott book cover" 
              className="float-left mr-6 mb-4 w-48 h-auto rounded-lg shadow-md"
            />
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              A biography called <em>Robert Sengstacke Abbott: A Man, a Paper, and a Parade</em>, especially for upper elementary school readers, has been published by Bellwood Press. It's the story of Mr. Abbott who was a true American hero. He used the newspaper he published, <em>The Chicago Defender</em>, as a voice to speak up for the beleaguered African Americans in this country, even though this put his life and livelihood at risk. In 2020, this biography won an Award of Excellence from the Religion Communicators Council. In 2019, it won a five-star review from Readers' Favorite Book Reviews and Awards.
            </p>
          </section>

          <section className="clear-both">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This is not a tiny book, but one that will fit on a library shelf! You can take a look at it at these websites:
            </p>
            <ul className="list-none text-gray-700 dark:text-gray-300 mb-4">
              <li className="mb-2">
                Bahá'í Bookstore – <a href="https://www.bahaibookstore.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.bahaibookstore.com</a>
              </li>
              <li className="mb-2">
                Barnes and Noble – <a href="https://www.barnesandnoble.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.barnesandnoble.com</a>
              </li>
              <li className="mb-2">
                Amazon – <a href="https://www.amazon.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.amazon.com</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
