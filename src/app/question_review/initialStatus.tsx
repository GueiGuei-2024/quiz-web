// import CarouselDemo from "./page";
// import { getQuestions } from "@/appwrite/questionbank";
// import { AppwriteQuestion } from "../types";

// export async function getServerSideProps() {
//   const defaultTime = ["111-1"];
//   const defaultType = ["醫學3"];
//   const res = await getQuestions(defaultTime, defaultType);
//   const data = res.documents.map((doc) => doc as AppwriteQuestion);

//   return {
//     props: {
//       initialQuestions: data
//     },
//   };
// }

// export default function CarouselPage({ initialQuestions }) {
//   return (
//     <CarouselDemo 
//       initialQuestions={initialQuestions}
//     />
//   );
// }