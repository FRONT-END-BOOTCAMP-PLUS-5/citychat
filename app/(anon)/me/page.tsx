import Footer from "@/app/components/Footer";
import SharedPageLayout from "@/app/SharedPageLayout";
import React from "react";

const page = () => {
  return (
    <div>
      <SharedPageLayout title="My Page">
        <div>
          page
        </div>
      </SharedPageLayout>
      <Footer />
    </div>
  );
};

export default page;
