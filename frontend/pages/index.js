// import FileUpload from '@/components/file_upload';
// import Marksheet from '../components/Marksheet';
// frontend/pages/index.js
// import UploadResult from '../components/UploadResult';
// import ViewResult from '../components/ViewResult';
// import CourseSelection from "@/components/course-selection";

// const HomePage = () => {
//   return (
//     <div>
//       {/* <UploadResult />
//       <ViewResult /> */}
//       <CourseSelection/>
//     </div>
//   );
// }

// export default HomePage;

/////////////////////cute final suru//////////////
import React from "react";
import Link from "next/link";
import Image from 'next/image';
import Header from "./Land/Header";
import Hero from "./Land/Hero";
import CardSection from "./Land/CardSection";
import Footer from "./Land/Footer";
const Home = () => {
  return (
    <div>
    
   <Header/>
  <Hero/>

    <CardSection/>
    <Footer/>
   
   
</div>
  );
};

export default Home;
